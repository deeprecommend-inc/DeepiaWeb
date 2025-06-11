import { WorkflowNode, WorkflowEdge, ExecutionContext, NodeData } from '../types/workflow';

export class WorkflowExecutionService {
  private apiClient: any;

  constructor(apiClient: any) {
    this.apiClient = apiClient;
  }

  async executeWorkflow(
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    onNodeStart?: (nodeId: string) => void,
    onNodeComplete?: (nodeId: string, result: any) => void,
    onNodeError?: (nodeId: string, error: string) => void
  ): Promise<ExecutionContext> {
    const context: ExecutionContext = {
      workflowId: `exec_${Date.now()}`,
      nodeResults: new Map(),
      isRunning: true,
    };

    try {
      // トポロジカルソートで実行順序を決定
      const executionOrder = this.topologicalSort(nodes, edges);
      
      for (const nodeId of executionOrder) {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) continue;

        context.currentNode = nodeId;
        onNodeStart?.(nodeId);

        try {
          // ノードの入力データを収集
          const inputData = this.collectInputData(node, edges, context.nodeResults);
          
          // ノードを実行
          const result = await this.executeNode(node, inputData);
          
          // 結果を保存
          context.nodeResults.set(nodeId, result);
          onNodeComplete?.(nodeId, result);
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          context.error = errorMessage;
          onNodeError?.(nodeId, errorMessage);
          throw error;
        }
      }

      context.isRunning = false;
      return context;

    } catch (error) {
      context.isRunning = false;
      context.error = error instanceof Error ? error.message : 'Workflow execution failed';
      throw error;
    }
  }

  private topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[] {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // グラフを構築
    nodes.forEach(node => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    edges.forEach(edge => {
      graph.get(edge.source)?.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    // トポロジカルソート
    const queue: string[] = [];
    const result: string[] = [];

    // 入次数が0のノードを見つける
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      graph.get(current)?.forEach(neighbor => {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      });
    }

    return result;
  }

  private collectInputData(
    node: WorkflowNode,
    edges: WorkflowEdge[],
    nodeResults: Map<string, any>
  ): Record<string, any> {
    const inputData: Record<string, any> = {};

    // このノードへの入力エッジを見つける
    const inputEdges = edges.filter(edge => edge.target === node.id);

    inputEdges.forEach(edge => {
      const sourceResult = nodeResults.get(edge.source);
      if (sourceResult) {
        // エッジのソースハンドルとターゲットハンドルを使って適切なデータをマッピング
        inputData[edge.targetHandle] = sourceResult[edge.sourceHandle] || sourceResult;
      }
    });

    return inputData;
  }

  private async executeNode(node: WorkflowNode, inputData: Record<string, any>): Promise<any> {
    switch (node.data.type) {
      case 'input':
        return this.executeInputNode(node, inputData);
      
      case 'output':
        return this.executeOutputNode(node, inputData);
      
      case 'text_generation':
        return this.executeTextGeneration(node, inputData);
      
      case 'code_generation':
        return this.executeCodeGeneration(node, inputData);
      
      case 'image_generation':
        return this.executeImageGeneration(node, inputData);
      
      case 'video_generation':
        return this.executeVideoGeneration(node, inputData);
      
      case 'audio_generation':
        return this.executeAudioGeneration(node, inputData);
      
      case 'model_3d_generation':
        return this.execute3DModelGeneration(node, inputData);
      
      case 'model_3d_swap':
        return this.execute3DModelSwap(node, inputData);
      
      case 'data_transformer':
        return this.executeDataTransformer(node, inputData);
      
      case 'conditional':
        return this.executeConditional(node, inputData);
      
      default:
        throw new Error(`Unknown node type: ${node.data.type}`);
    }
  }

  private async executeInputNode(node: WorkflowNode, inputData: Record<string, any>): Promise<any> {
    // 入力ノードは設定された値をそのまま出力
    return {
      output: node.data.config.value || 'Input data'
    };
  }

  private async executeOutputNode(node: WorkflowNode, inputData: Record<string, any>): Promise<any> {
    // 出力ノードは入力をそのまま返す
    return {
      result: inputData.input || inputData
    };
  }

  private async executeTextGeneration(node: WorkflowNode, inputData: Record<string, any>): Promise<any> {
    const prompt = inputData.prompt || node.data.config.defaultPrompt || '';
    const context = inputData.context || '';
    
    try {
      // GPT API呼び出し（実際のAPI実装に置き換える）
      const response = await this.apiClient.generateText({
        prompt: context ? `${context}\n\n${prompt}` : prompt,
        model: node.data.config.textModel || 'gpt-4',
        temperature: node.data.config.temperature || 0.7,
        maxTokens: node.data.config.maxTokens || 1000
      });

      return {
        text: response.text || `Generated text for: ${prompt}`
      };
    } catch (error) {
      console.error('Text generation failed:', error);
      return {
        text: `[Text Generation Error] ${prompt}`
      };
    }
  }

  private async executeCodeGeneration(node: WorkflowNode, inputData: Record<string, any>): Promise<any> {
    const prompt = inputData.prompt || '';
    const requirements = inputData.requirements || '';
    
    try {
      const response = await this.apiClient.generateCode({
        prompt: requirements ? `Requirements: ${requirements}\n\nTask: ${prompt}` : prompt,
        language: node.data.config.codeLanguage || 'javascript',
        framework: node.data.config.framework
      });

      return {
        code: response.code || `// Generated code for: ${prompt}\nconsole.log('Hello, World!');`
      };
    } catch (error) {
      console.error('Code generation failed:', error);
      return {
        code: `// Code Generation Error\n// ${prompt}`
      };
    }
  }

  private async executeImageGeneration(node: WorkflowNode, inputData: Record<string, any>): Promise<any> {
    const prompt = inputData.prompt || '';
    const style = inputData.style || '';
    
    try {
      const response = await this.apiClient.piapi_generate({
        model: node.data.config.imageModel || 'midjourney',
        prompt: style ? `${prompt}, ${style}` : prompt,
        aspectRatio: '16:9'
      });

      return {
        image: response.data?.result?.url || `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16">Generated Image: ${prompt}</text></svg>`
      };
    } catch (error) {
      console.error('Image generation failed:', error);
      return {
        image: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23ff6b6b"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="white">Image Error: ${prompt}</text></svg>`
      };
    }
  }

  private async executeVideoGeneration(node: WorkflowNode, inputData: Record<string, any>): Promise<any> {
    const prompt = inputData.prompt || '';
    const style = inputData.style || '';
    
    try {
      const response = await this.apiClient.piapi_generate({
        model: node.data.config.videoModel || 'dream_machine',
        prompt: style ? `${prompt}, ${style}` : prompt,
        duration: node.data.config.duration || '10s',
        resolution: node.data.config.resolution || '1080p'
      });

      return {
        video: response.data?.result?.url || `https://example.com/video/${Date.now()}.mp4`
      };
    } catch (error) {
      console.error('Video generation failed:', error);
      return {
        video: null,
        error: `Video generation failed: ${error}`
      };
    }
  }

  private async executeAudioGeneration(node: WorkflowNode, inputData: Record<string, any>): Promise<any> {
    const prompt = inputData.prompt || '';
    const genre = inputData.genre || '';
    const lyrics = inputData.lyrics || '';
    
    try {
      const response = await this.apiClient.piapi_generate({
        model: node.data.config.audioModel || 'suno',
        prompt: genre ? `${prompt}, genre: ${genre}` : prompt,
        instrumental: node.data.config.instrumental || false,
        lyrics: lyrics
      });

      return {
        audio: response.data?.result?.url || `https://example.com/audio/${Date.now()}.mp3`
      };
    } catch (error) {
      console.error('Audio generation failed:', error);
      return {
        audio: null,
        error: `Audio generation failed: ${error}`
      };
    }
  }

  private async execute3DModelGeneration(node: WorkflowNode, inputData: Record<string, any>): Promise<any> {
    const prompt = inputData.prompt || '';
    
    // 3Dモデル生成のシミュレーション（実際のAPIに置き換える）
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      model: `https://example.com/models/${Date.now()}.${node.data.config.model3dFormat || 'obj'}`,
      format: node.data.config.model3dFormat || 'obj'
    };
  }

  private async execute3DModelSwap(node: WorkflowNode, inputData: Record<string, any>): Promise<any> {
    const sourceModel = inputData.source_model;
    const targetModel = inputData.target_model;
    const swapParts = inputData.swap_parts || '';
    
    // 3Dモデルスワップのシミュレーション
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      swapped_model: `https://example.com/models/swapped_${Date.now()}.obj`,
      parts_swapped: swapParts.split(',').map((part: string) => part.trim())
    };
  }

  private async executeDataTransformer(node: WorkflowNode, inputData: Record<string, any>): Promise<any> {
    const input = inputData.input;
    const format = inputData.format || 'json';
    
    // データ変換ロジック
    let output;
    
    switch (format.toLowerCase()) {
      case 'json':
        output = JSON.stringify(input, null, 2);
        break;
      case 'csv':
        if (Array.isArray(input)) {
          output = input.map(row => Object.values(row).join(',')).join('\n');
        } else {
          output = Object.values(input).join(',');
        }
        break;
      case 'text':
        output = typeof input === 'string' ? input : JSON.stringify(input);
        break;
      default:
        output = input;
    }
    
    return {
      output: output
    };
  }

  private async executeConditional(node: WorkflowNode, inputData: Record<string, any>): Promise<any> {
    const condition = inputData.condition || 'true';
    const inputTrue = inputData.input_true;
    const inputFalse = inputData.input_false;
    
    // 簡単な条件評価（実際の実装ではより安全な評価が必要）
    let conditionResult;
    try {
      conditionResult = eval(condition.replace(/[^a-zA-Z0-9\s><=!&|()]/g, ''));
    } catch {
      conditionResult = false;
    }
    
    return {
      output: conditionResult ? inputTrue : inputFalse
    };
  }
}