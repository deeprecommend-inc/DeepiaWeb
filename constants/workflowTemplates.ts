import { Workflow } from '../types/workflow';

export const workflowTemplates: Workflow[] = [
  {
    id: 'template_content_creation',
    name: 'コンテンツ作成パイプライン',
    description: 'テキストから画像、動画、音楽を順次生成する完全なコンテンツ作成ワークフロー',
    nodes: [
      {
        id: 'input_1',
        type: 'input',
        position: { x: 100, y: 200 },
        data: {
          id: 'input_1',
          type: 'input',
          label: 'コンテンツテーマ',
          description: 'メインテーマを入力',
          config: { value: 'サイバーパンクの未来都市' },
          inputs: [],
          outputs: [{ id: 'output', name: '出力', type: 'text' }]
        }
      },
      {
        id: 'text_gen_1',
        type: 'text_generation',
        position: { x: 350, y: 150 },
        data: {
          id: 'text_gen_1',
          type: 'text_generation',
          label: '詳細説明生成',
          description: 'テーマから詳細な説明を生成',
          config: { textModel: 'gpt-4', temperature: 0.8, maxTokens: 500 },
          inputs: [{ id: 'prompt', name: 'プロンプト', type: 'text', required: true }],
          outputs: [{ id: 'text', name: '生成文章', type: 'text' }]
        }
      },
      {
        id: 'image_gen_1',
        type: 'image_generation',
        position: { x: 600, y: 100 },
        data: {
          id: 'image_gen_1',
          type: 'image_generation',
          label: '画像生成',
          description: '説明から画像を生成',
          config: { imageModel: 'midjourney', width: 1024, height: 1024 },
          inputs: [
            { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
            { id: 'style', name: 'スタイル', type: 'text', required: false }
          ],
          outputs: [{ id: 'image', name: '生成画像', type: 'image' }]
        }
      },
      {
        id: 'video_gen_1',
        type: 'video_generation',
        position: { x: 600, y: 250 },
        data: {
          id: 'video_gen_1',
          type: 'video_generation',
          label: '動画生成',
          description: '画像から動画を生成',
          config: { videoModel: 'dream_machine', duration: '10s', resolution: '1080p' },
          inputs: [
            { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
            { id: 'image', name: '開始画像', type: 'image', required: false }
          ],
          outputs: [{ id: 'video', name: '生成動画', type: 'video' }]
        }
      },
      {
        id: 'audio_gen_1',
        type: 'audio_generation',
        position: { x: 350, y: 350 },
        data: {
          id: 'audio_gen_1',
          type: 'audio_generation',
          label: 'BGM生成',
          description: 'テーマに合った音楽を生成',
          config: { audioModel: 'suno', instrumental: true },
          inputs: [
            { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
            { id: 'genre', name: 'ジャンル', type: 'text', required: false }
          ],
          outputs: [{ id: 'audio', name: '生成音声', type: 'audio' }]
        }
      },
      {
        id: 'output_1',
        type: 'output',
        position: { x: 850, y: 200 },
        data: {
          id: 'output_1',
          type: 'output',
          label: '最終成果物',
          description: '全ての生成物をまとめて出力',
          config: {},
          inputs: [
            { id: 'text', name: 'テキスト', type: 'text', required: false },
            { id: 'image', name: '画像', type: 'image', required: false },
            { id: 'video', name: '動画', type: 'video', required: false },
            { id: 'audio', name: '音声', type: 'audio', required: false }
          ],
          outputs: []
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'input_1',
        target: 'text_gen_1',
        sourceHandle: 'output',
        targetHandle: 'prompt'
      },
      {
        id: 'e2',
        source: 'text_gen_1',
        target: 'image_gen_1',
        sourceHandle: 'text',
        targetHandle: 'prompt'
      },
      {
        id: 'e3',
        source: 'text_gen_1',
        target: 'video_gen_1',
        sourceHandle: 'text',
        targetHandle: 'prompt'
      },
      {
        id: 'e4',
        source: 'image_gen_1',
        target: 'video_gen_1',
        sourceHandle: 'image',
        targetHandle: 'image'
      },
      {
        id: 'e5',
        source: 'input_1',
        target: 'audio_gen_1',
        sourceHandle: 'output',
        targetHandle: 'prompt'
      },
      {
        id: 'e6',
        source: 'text_gen_1',
        target: 'output_1',
        sourceHandle: 'text',
        targetHandle: 'text'
      },
      {
        id: 'e7',
        source: 'image_gen_1',
        target: 'output_1',
        sourceHandle: 'image',
        targetHandle: 'image'
      },
      {
        id: 'e8',
        source: 'video_gen_1',
        target: 'output_1',
        sourceHandle: 'video',
        targetHandle: 'video'
      },
      {
        id: 'e9',
        source: 'audio_gen_1',
        target: 'output_1',
        sourceHandle: 'audio',
        targetHandle: 'audio'
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'template_code_and_docs',
    name: 'コード生成 + ドキュメント作成',
    description: '要件からコードを生成し、自動でドキュメントも作成するワークフロー',
    nodes: [
      {
        id: 'input_requirements',
        type: 'input',
        position: { x: 100, y: 200 },
        data: {
          id: 'input_requirements',
          type: 'input',
          label: '機能要件',
          description: '実装したい機能の要件を入力',
          config: { value: 'TODOリストアプリのReactコンポーネント' },
          inputs: [],
          outputs: [{ id: 'output', name: '出力', type: 'text' }]
        }
      },
      {
        id: 'code_gen_1',
        type: 'code_generation',
        position: { x: 350, y: 150 },
        data: {
          id: 'code_gen_1',
          type: 'code_generation',
          label: 'コード生成',
          description: '要件からコードを生成',
          config: { codeLanguage: 'typescript', framework: 'react' },
          inputs: [
            { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
            { id: 'requirements', name: '要件', type: 'text', required: false }
          ],
          outputs: [{ id: 'code', name: '生成コード', type: 'code' }]
        }
      },
      {
        id: 'text_gen_docs',
        type: 'text_generation',
        position: { x: 350, y: 300 },
        data: {
          id: 'text_gen_docs',
          type: 'text_generation',
          label: 'ドキュメント生成',
          description: 'コードからAPIドキュメントを生成',
          config: { textModel: 'gpt-4', temperature: 0.3, maxTokens: 1000 },
          inputs: [
            { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
            { id: 'context', name: 'コンテキスト', type: 'text', required: false }
          ],
          outputs: [{ id: 'text', name: '生成文章', type: 'text' }]
        }
      },
      {
        id: 'transformer_1',
        type: 'data_transformer',
        position: { x: 600, y: 150 },
        data: {
          id: 'transformer_1',
          type: 'data_transformer',
          label: 'コード整形',
          description: 'コードを読みやすく整形',
          config: {},
          inputs: [
            { id: 'input', name: '入力データ', type: 'any', required: true },
            { id: 'format', name: '変換形式', type: 'text', required: true }
          ],
          outputs: [{ id: 'output', name: '変換済みデータ', type: 'any' }]
        }
      },
      {
        id: 'output_final',
        type: 'output',
        position: { x: 850, y: 225 },
        data: {
          id: 'output_final',
          type: 'output',
          label: '最終成果物',
          description: 'コードとドキュメントを出力',
          config: {},
          inputs: [
            { id: 'code', name: 'コード', type: 'code', required: false },
            { id: 'docs', name: 'ドキュメント', type: 'text', required: false }
          ],
          outputs: []
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'input_requirements',
        target: 'code_gen_1',
        sourceHandle: 'output',
        targetHandle: 'prompt'
      },
      {
        id: 'e2',
        source: 'code_gen_1',
        target: 'text_gen_docs',
        sourceHandle: 'code',
        targetHandle: 'context'
      },
      {
        id: 'e3',
        source: 'code_gen_1',
        target: 'transformer_1',
        sourceHandle: 'code',
        targetHandle: 'input'
      },
      {
        id: 'e4',
        source: 'transformer_1',
        target: 'output_final',
        sourceHandle: 'output',
        targetHandle: 'code'
      },
      {
        id: 'e5',
        source: 'text_gen_docs',
        target: 'output_final',
        sourceHandle: 'text',
        targetHandle: 'docs'
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'template_3d_pipeline',
    name: '3Dモデル生成パイプライン',
    description: 'テキストから3Dモデルを生成し、別のモデルと組み合わせるワークフロー',
    nodes: [
      {
        id: 'input_3d_concept',
        type: 'input',
        position: { x: 100, y: 150 },
        data: {
          id: 'input_3d_concept',
          type: 'input',
          label: '3Dコンセプト',
          description: '作成したい3Dモデルのコンセプト',
          config: { value: '近未来的なロボット' },
          inputs: [],
          outputs: [{ id: 'output', name: '出力', type: 'text' }]
        }
      },
      {
        id: 'input_base_model',
        type: 'input',
        position: { x: 100, y: 300 },
        data: {
          id: 'input_base_model',
          type: 'input',
          label: 'ベースモデル',
          description: 'ベースとなる3Dモデル',
          config: { value: 'https://example.com/base_humanoid.obj' },
          inputs: [],
          outputs: [{ id: 'output', name: '出力', type: 'model3d' }]
        }
      },
      {
        id: 'model3d_gen_1',
        type: 'model_3d_generation',
        position: { x: 350, y: 150 },
        data: {
          id: 'model3d_gen_1',
          type: 'model_3d_generation',
          label: '3Dモデル生成',
          description: 'コンセプトから3Dモデルを生成',
          config: { model3dFormat: 'obj', quality: 'high' },
          inputs: [
            { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
            { id: 'reference', name: '参考画像', type: 'image', required: false }
          ],
          outputs: [{ id: 'model', name: '3Dモデル', type: 'model3d' }]
        }
      },
      {
        id: 'model3d_swap_1',
        type: 'model_3d_swap',
        position: { x: 600, y: 225 },
        data: {
          id: 'model3d_swap_1',
          type: 'model_3d_swap',
          label: '3Dモデル統合',
          description: '生成したモデルとベースモデルを統合',
          config: { model3dFormat: 'obj' },
          inputs: [
            { id: 'source_model', name: '元モデル', type: 'model3d', required: true },
            { id: 'target_model', name: '対象モデル', type: 'model3d', required: true },
            { id: 'swap_parts', name: 'スワップ部位', type: 'text', required: false }
          ],
          outputs: [{ id: 'swapped_model', name: 'スワップ済みモデル', type: 'model3d' }]
        }
      },
      {
        id: 'output_3d',
        type: 'output',
        position: { x: 850, y: 225 },
        data: {
          id: 'output_3d',
          type: 'output',
          label: '最終3Dモデル',
          description: '統合された3Dモデルを出力',
          config: {},
          inputs: [
            { id: 'model', name: '3Dモデル', type: 'model3d', required: true }
          ],
          outputs: []
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'input_3d_concept',
        target: 'model3d_gen_1',
        sourceHandle: 'output',
        targetHandle: 'prompt'
      },
      {
        id: 'e2',
        source: 'input_base_model',
        target: 'model3d_swap_1',
        sourceHandle: 'output',
        targetHandle: 'source_model'
      },
      {
        id: 'e3',
        source: 'model3d_gen_1',
        target: 'model3d_swap_1',
        sourceHandle: 'model',
        targetHandle: 'target_model'
      },
      {
        id: 'e4',
        source: 'model3d_swap_1',
        target: 'output_3d',
        sourceHandle: 'swapped_model',
        targetHandle: 'model'
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const getWorkflowTemplateByCategory = (category: string) => {
  switch (category) {
    case 'content':
      return workflowTemplates.filter(t => t.id.includes('content'));
    case 'code':
      return workflowTemplates.filter(t => t.id.includes('code'));
    case '3d':
      return workflowTemplates.filter(t => t.id.includes('3d'));
    default:
      return workflowTemplates;
  }
};