// piapi.yamlに基づいたAIモデル設定

export interface AIModel {
  id: string;
  name: string;
  category: 'image' | 'video' | 'audio' | 'text' | '3d';
  provider: string;
  description: string;
  parameters: ModelParameter[];
  taskTypes: TaskType[];
  pricing?: string;
  examples?: string[];
}

export interface ModelParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'array';
  required: boolean;
  default?: any;
  options?: string[] | number[];
  description: string;
  min?: number;
  max?: number;
}

export interface TaskType {
  id: string;
  name: string;
  description: string;
  parameters?: ModelParameter[];
}

// 画像生成モデル
export const imageGenerationModels: AIModel[] = [
  {
    id: 'midjourney',
    name: 'Midjourney V7',
    category: 'image',
    provider: 'Midjourney',
    description: '最高品質のアートスタイル画像生成',
    taskTypes: [
      {
        id: 'imagine',
        name: '画像生成',
        description: 'プロンプトから4枚画像生成（2x2グリッド）'
      },
      {
        id: 'upscale',
        name: 'アップスケール',
        description: '画像解像度向上・分離'
      },
      {
        id: 'blend',
        name: '画像マージ',
        description: '2-5枚画像のマージ'
      }
    ],
    parameters: [
      {
        id: 'prompt',
        name: 'プロンプト',
        type: 'string',
        required: true,
        description: '画像生成用テキストプロンプト'
      },
      {
        id: 'aspect_ratio',
        name: 'アスペクト比',
        type: 'select',
        required: false,
        default: '1:1',
        options: ['1:1', '4:3', '3:4', '16:9', '9:16'],
        description: '画像のアスペクト比'
      },
      {
        id: 'process_mode',
        name: '処理モード',
        type: 'select',
        required: false,
        default: 'fast',
        options: ['relax', 'fast', 'turbo'],
        description: '生成速度と品質のバランス'
      },
      {
        id: 'skip_prompt_check',
        name: 'プロンプトチェックスキップ',
        type: 'boolean',
        required: false,
        default: false,
        description: 'プロンプトのコンテンツチェックをスキップ'
      }
    ],
    pricing: '従量制・シート制両対応',
    examples: [
      'beautiful landscape with mountains and lake, photorealistic',
      'anime style character design, colorful',
      'modern architecture building, minimalist style'
    ]
  },
  {
    id: 'flux_schnell',
    name: 'Flux Schnell',
    category: 'image',
    provider: 'Flux',
    description: '高速画像生成モデル',
    taskTypes: [
      {
        id: 'generate',
        name: '高速生成',
        description: '高速で画像を生成'
      }
    ],
    parameters: [
      {
        id: 'prompt',
        name: 'プロンプト',
        type: 'string',
        required: true,
        description: '画像生成用テキストプロンプト'
      },
      {
        id: 'width',
        name: '幅',
        type: 'number',
        required: false,
        default: 512,
        min: 256,
        max: 2048,
        description: '画像の幅（ピクセル）'
      },
      {
        id: 'height',
        name: '高さ',
        type: 'number',
        required: false,
        default: 512,
        min: 256,
        max: 2048,
        description: '画像の高さ（ピクセル）'
      },
      {
        id: 'guidance_scale',
        name: 'ガイダンススケール',
        type: 'number',
        required: false,
        default: 7.5,
        min: 1,
        max: 20,
        description: 'プロンプトへの従順度'
      }
    ],
    examples: [
      'realistic portrait of a person',
      'abstract digital art',
      'nature photography style'
    ]
  },
  {
    id: 'flux_dev',
    name: 'Flux Dev',
    category: 'image',
    provider: 'Flux',
    description: '高品質画像生成モデル',
    taskTypes: [
      {
        id: 'generate',
        name: '高品質生成',
        description: '高品質で画像を生成'
      }
    ],
    parameters: [
      {
        id: 'prompt',
        name: 'プロンプト',
        type: 'string',
        required: true,
        description: '画像生成用テキストプロンプト'
      },
      {
        id: 'width',
        name: '幅',
        type: 'number',
        required: false,
        default: 1024,
        min: 256,
        max: 2048,
        description: '画像の幅（ピクセル）'
      },
      {
        id: 'height',
        name: '高さ',
        type: 'number',
        required: false,
        default: 1024,
        min: 256,
        max: 2048,
        description: '画像の高さ（ピクセル）'
      },
      {
        id: 'guidance_scale',
        name: 'ガイダンススケール',
        type: 'number',
        required: false,
        default: 7.5,
        min: 1,
        max: 20,
        description: 'プロンプトへの従順度'
      },
      {
        id: 'steps',
        name: 'ステップ数',
        type: 'number',
        required: false,
        default: 50,
        min: 10,
        max: 100,
        description: '生成ステップ数（品質と時間のトレードオフ）'
      }
    ],
    examples: [
      'high resolution artistic painting',
      'detailed character concept art',
      'professional product photography'
    ]
  }
];

// 動画生成モデル
export const videoGenerationModels: AIModel[] = [
  {
    id: 'kling',
    name: 'Kling Video',
    category: 'video',
    provider: 'Kling',
    description: '高品質動画生成モデル',
    taskTypes: [
      {
        id: 'text_to_video',
        name: 'テキストから動画',
        description: 'テキストプロンプトから動画生成'
      },
      {
        id: 'image_to_video',
        name: '画像から動画',
        description: '静止画から動画生成'
      }
    ],
    parameters: [
      {
        id: 'prompt',
        name: 'プロンプト',
        type: 'string',
        required: true,
        description: '動画生成用テキストプロンプト'
      },
      {
        id: 'image_url',
        name: '開始画像',
        type: 'string',
        required: false,
        description: '動画の開始フレームとなる画像URL'
      },
      {
        id: 'image_tail_url',
        name: '終了画像',
        type: 'string',
        required: false,
        description: '動画の終了フレームとなる画像URL'
      },
      {
        id: 'duration',
        name: '長さ（秒）',
        type: 'select',
        required: false,
        default: '5',
        options: ['5', '10'],
        description: '動画の長さ'
      },
      {
        id: 'aspect_ratio',
        name: 'アスペクト比',
        type: 'select',
        required: false,
        default: '16:9',
        options: ['16:9', '9:16', '1:1'],
        description: '動画のアスペクト比'
      }
    ],
    examples: [
      'a beautiful sunset over the ocean',
      'cat walking in a garden',
      'abstract fluid motion'
    ]
  },
  {
    id: 'luma',
    name: 'Luma Dream Machine',
    category: 'video',
    provider: 'Luma',
    description: '次世代動画生成AI',
    taskTypes: [
      {
        id: 'generation',
        name: '動画生成',
        description: 'プロンプトから動画生成'
      }
    ],
    parameters: [
      {
        id: 'prompt',
        name: 'プロンプト',
        type: 'string',
        required: true,
        description: '動画生成用テキストプロンプト'
      },
      {
        id: 'keyframes',
        name: 'キーフレーム',
        type: 'array',
        required: false,
        description: 'キーフレーム画像のURL配列'
      }
    ],
    examples: [
      'cinematic shot of a futuristic city',
      'nature documentary style',
      'smooth camera movement through forest'
    ]
  }
];

// 音楽生成モデル
export const audioGenerationModels: AIModel[] = [
  {
    id: 'suno',
    name: 'Suno Music',
    category: 'audio',
    provider: 'Suno',
    description: '高品質音楽生成AI',
    taskTypes: [
      {
        id: 'generate',
        name: '音楽生成',
        description: 'プロンプトから音楽生成'
      }
    ],
    parameters: [
      {
        id: 'prompt',
        name: 'プロンプト',
        type: 'string',
        required: true,
        description: '音楽生成用テキストプロンプト'
      },
      {
        id: 'style',
        name: 'スタイル',
        type: 'select',
        required: false,
        options: ['pop', 'rock', 'jazz', 'classical', 'electronic', 'ambient'],
        description: '音楽のスタイル'
      },
      {
        id: 'duration',
        name: '長さ（秒）',
        type: 'number',
        required: false,
        default: 30,
        min: 10,
        max: 120,
        description: '音楽の長さ'
      },
      {
        id: 'instrumental',
        name: 'インストゥルメンタル',
        type: 'boolean',
        required: false,
        default: false,
        description: 'ボーカルなしの楽曲'
      }
    ],
    examples: [
      'upbeat pop song about summer',
      'peaceful ambient music for relaxation',
      'energetic rock instrumental'
    ]
  }
];

// 3Dモデル生成
export const model3DGenerationModels: AIModel[] = [
  {
    id: 'meshy',
    name: 'Meshy 3D',
    category: '3d',
    provider: 'Meshy',
    description: '3Dモデル生成AI',
    taskTypes: [
      {
        id: 'text_to_3d',
        name: 'テキストから3D',
        description: 'テキストから3Dモデル生成'
      },
      {
        id: 'image_to_3d',
        name: '画像から3D',
        description: '画像から3Dモデル生成'
      }
    ],
    parameters: [
      {
        id: 'prompt',
        name: 'プロンプト',
        type: 'string',
        required: true,
        description: '3Dモデル生成用テキストプロンプト'
      },
      {
        id: 'style',
        name: 'スタイル',
        type: 'select',
        required: false,
        options: ['realistic', 'cartoon', 'low_poly', 'sculpted'],
        description: '3Dモデルのスタイル'
      }
    ],
    examples: [
      'modern chair design',
      'fantasy character model',
      'architectural building'
    ]
  }
];

// 全モデルをまとめて取得
export const getAllModels = (): AIModel[] => [
  ...imageGenerationModels,
  ...videoGenerationModels,
  ...audioGenerationModels,
  ...model3DGenerationModels
];

// カテゴリ別取得
export const getModelsByCategory = (category: string): AIModel[] => {
  return getAllModels().filter(model => model.category === category);
};

// モデル取得
export const getModelById = (id: string): AIModel | undefined => {
  return getAllModels().find(model => model.id === id);
};