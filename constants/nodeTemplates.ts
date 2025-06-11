import { NodeTemplate } from '../types/workflow';

export const nodeTemplates: NodeTemplate[] = [
  // Input/Output Nodes
  {
    id: 'input',
    name: '入力',
    description: 'ワークフローの開始点',
    type: 'input',
    category: 'io',
    icon: '📥',
    color: '#4CAF50',
    defaultConfig: {},
    inputs: [],
    outputs: [
      { id: 'output', name: '出力', type: 'any' }
    ]
  },
  {
    id: 'output',
    name: '出力',
    description: 'ワークフローの終了点',
    type: 'output',
    category: 'io',
    icon: '📤',
    color: '#F44336',
    defaultConfig: {},
    inputs: [
      { id: 'input', name: '入力', type: 'any', required: true }
    ],
    outputs: []
  },

  // Text Generation
  {
    id: 'text_generation',
    name: '文章生成',
    description: 'AIを使って文章を生成',
    type: 'text_generation',
    category: 'generation',
    icon: '📝',
    color: '#2196F3',
    defaultConfig: {
      textModel: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000
    },
    inputs: [
      { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
      { id: 'context', name: 'コンテキスト', type: 'text', required: false }
    ],
    outputs: [
      { id: 'text', name: '生成文章', type: 'text' }
    ]
  },

  // Code Generation
  {
    id: 'code_generation',
    name: 'コード生成',
    description: 'AIを使ってコードを生成',
    type: 'code_generation',
    category: 'generation',
    icon: '💻',
    color: '#FF9800',
    defaultConfig: {
      codeLanguage: 'javascript',
      framework: 'react'
    },
    inputs: [
      { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
      { id: 'requirements', name: '要件', type: 'text', required: false }
    ],
    outputs: [
      { id: 'code', name: '生成コード', type: 'code' }
    ]
  },

  // Image Generation
  {
    id: 'image_generation',
    name: 'イメージ生成',
    description: 'AIを使って画像を生成',
    type: 'image_generation',
    category: 'generation',
    icon: '🎨',
    color: '#E91E63',
    defaultConfig: {
      imageModel: 'midjourney',
      width: 1024,
      height: 1024,
      steps: 50
    },
    inputs: [
      { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
      { id: 'style', name: 'スタイル', type: 'text', required: false },
      { id: 'reference', name: '参考画像', type: 'image', required: false }
    ],
    outputs: [
      { id: 'image', name: '生成画像', type: 'image' }
    ]
  },

  // Video Generation
  {
    id: 'video_generation',
    name: 'ビデオ生成',
    description: 'AIを使って動画を生成',
    type: 'video_generation',
    category: 'generation',
    icon: '🎬',
    color: '#9C27B0',
    defaultConfig: {
      videoModel: 'dream_machine',
      duration: '10s',
      resolution: '1080p',
      aspectRatio: '16:9'
    },
    inputs: [
      { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
      { id: 'image', name: '開始画像', type: 'image', required: false },
      { id: 'style', name: 'スタイル', type: 'text', required: false }
    ],
    outputs: [
      { id: 'video', name: '生成動画', type: 'video' }
    ]
  },

  // Audio Generation
  {
    id: 'audio_generation',
    name: 'オーディオ生成',
    description: 'AIを使って音楽・音声を生成',
    type: 'audio_generation',
    category: 'generation',
    icon: '🎵',
    color: '#00BCD4',
    defaultConfig: {
      audioModel: 'suno',
      instrumental: false,
      duration: 30
    },
    inputs: [
      { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
      { id: 'genre', name: 'ジャンル', type: 'text', required: false },
      { id: 'lyrics', name: '歌詞', type: 'text', required: false }
    ],
    outputs: [
      { id: 'audio', name: '生成音声', type: 'audio' }
    ]
  },

  // 3D Model Generation
  {
    id: 'model_3d_generation',
    name: '3Dモデル生成',
    description: 'AIを使って3Dモデルを生成',
    type: 'model_3d_generation',
    category: 'generation',
    icon: '🧊',
    color: '#795548',
    defaultConfig: {
      model3dFormat: 'obj',
      quality: 'high'
    },
    inputs: [
      { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
      { id: 'reference', name: '参考画像', type: 'image', required: false }
    ],
    outputs: [
      { id: 'model', name: '3Dモデル', type: 'model3d' }
    ]
  },

  // 3D Swap
  {
    id: 'model_3d_swap',
    name: '3Dスワップ',
    description: '3Dモデルの一部を置き換え',
    type: 'model_3d_swap',
    category: 'generation',
    icon: '🔄',
    color: '#607D8B',
    defaultConfig: {
      model3dFormat: 'obj'
    },
    inputs: [
      { id: 'source_model', name: '元モデル', type: 'model3d', required: true },
      { id: 'target_model', name: '対象モデル', type: 'model3d', required: true },
      { id: 'swap_parts', name: 'スワップ部位', type: 'text', required: false }
    ],
    outputs: [
      { id: 'swapped_model', name: 'スワップ済みモデル', type: 'model3d' }
    ]
  },

  // Data Transformer
  {
    id: 'data_transformer',
    name: 'データ変換',
    description: 'データを別の形式に変換',
    type: 'data_transformer',
    category: 'utility',
    icon: '🔧',
    color: '#9E9E9E',
    defaultConfig: {},
    inputs: [
      { id: 'input', name: '入力データ', type: 'any', required: true },
      { id: 'format', name: '変換形式', type: 'text', required: true }
    ],
    outputs: [
      { id: 'output', name: '変換済みデータ', type: 'any' }
    ]
  },

  // Conditional
  {
    id: 'conditional',
    name: '条件分岐',
    description: '条件に基づいて処理を分岐',
    type: 'conditional',
    category: 'utility',
    icon: '🔀',
    color: '#FF5722',
    defaultConfig: {},
    inputs: [
      { id: 'condition', name: '条件', type: 'text', required: true },
      { id: 'input_true', name: 'True入力', type: 'any', required: false },
      { id: 'input_false', name: 'False入力', type: 'any', required: false }
    ],
    outputs: [
      { id: 'output', name: '出力', type: 'any' }
    ]
  }
];

export const nodeCategories = [
  { id: 'io', name: '入出力', icon: '📋' },
  { id: 'generation', name: 'AI生成', icon: '🤖' },
  { id: 'utility', name: 'ユーティリティ', icon: '🛠️' }
];