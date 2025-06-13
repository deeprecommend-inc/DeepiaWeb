// Workflow system types and interfaces

export type NodeType = 
  | 'input'
  | 'output'
  | 'text_generation'
  | 'code_generation'
  | 'image_generation'
  | 'video_generation'
  | 'audio_generation'
  | 'model_3d_generation'
  | 'face_swap'
  | 'data_transformer'
  | 'conditional'
  | 'midjourney_generation'
  | 'flux_generation'
  | 'kling_generation'
  | 'luma_generation'
  | 'music_generation'
  | 'tts_generation'
  | 'model_3d_swap';

export interface NodeData {
  id: string;
  type: NodeType;
  label: string;
  description?: string;
  config: Record<string, any>;
  inputs: NodeInput[];
  outputs: NodeOutput[];
}

export interface NodeInput {
  id: string;
  name: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'code' | 'model3d' | 'any' | 'select' | 'number' | 'array' | 'object';
  required: boolean;
  value?: any;
  options?: string[];
}

export interface NodeOutput {
  id: string;
  name: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'code' | 'model3d' | 'any' | 'select' | 'number' | 'array' | 'object';
  value?: any;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  type?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExecutionContext {
  workflowId: string;
  nodeResults: Map<string, any>;
  isRunning: boolean;
  currentNode?: string;
  error?: string;
}

export interface GenerationConfig {
  // Text Generation
  textModel?: string;
  temperature?: number;
  maxTokens?: number;
  
  // Image Generation
  imageModel?: string;
  width?: number;
  height?: number;
  steps?: number;
  
  // Video Generation
  videoModel?: string;
  duration?: string;
  resolution?: string;
  aspectRatio?: string;
  
  // Audio Generation
  audioModel?: string;
  instrumental?: boolean;
  audioDuration?: number;
  
  // Code Generation
  codeLanguage?: string;
  framework?: string;
  
  // 3D Generation
  model3dFormat?: string;
  quality?: string;
}

export interface NodeTemplate {
  id: string;
  name: string;
  description: string;
  type: NodeType;
  category: string;
  icon: string;
  color: string;
  defaultConfig: Record<string, any>;
  inputs: Omit<NodeInput, 'value'>[];
  outputs: NodeOutput[];
}