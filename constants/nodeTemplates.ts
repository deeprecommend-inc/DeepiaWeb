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

  // Midjourney Image Generation
  {
    id: 'midjourney_generation',
    name: 'Midjourney画像生成',
    description: 'Midjourney V7で高品質画像生成',
    type: 'midjourney_generation',
    category: 'generation',
    icon: '🎨',
    color: '#E91E63',
    defaultConfig: {
      model: 'midjourney',
      task_type: 'imagine',
      aspect_ratio: '1:1',
      process_mode: 'fast',
      skip_prompt_check: false
    },
    inputs: [
      { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
      { id: 'aspect_ratio', name: 'アスペクト比', type: 'select', required: false, options: ['1:1', '4:3', '3:4', '16:9', '9:16'] },
      { id: 'process_mode', name: '処理モード', type: 'select', required: false, options: ['relax', 'fast', 'turbo'] }
    ],
    outputs: [
      { id: 'image', name: '生成画像', type: 'image' },
      { id: 'task_id', name: 'タスクID', type: 'text' }
    ]
  },

  // Flux Image Generation
  {
    id: 'flux_generation',
    name: 'Flux画像生成',
    description: 'Flux高速・高品質画像生成',
    type: 'flux_generation',
    category: 'generation',
    icon: '⚡',
    color: '#FF9800',
    defaultConfig: {
      model: 'Qubico/flux1-dev',
      task_type: 'txt2img',
      width: 1024,
      height: 1024,
      guidance_scale: 3.5,
      batch_size: 1
    },
    inputs: [
      { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
      { id: 'negative_prompt', name: 'ネガティブプロンプト', type: 'text', required: false },
      { id: 'width', name: '幅', type: 'number', required: false },
      { id: 'height', name: '高さ', type: 'number', required: false },
      { id: 'guidance_scale', name: 'ガイダンススケール', type: 'number', required: false },
      { id: 'lora_settings', name: 'LoRA設定', type: 'array', required: false }
    ],
    outputs: [
      { id: 'image', name: '生成画像', type: 'image' }
    ]
  },

  // Kling Video Generation
  {
    id: 'kling_generation',
    name: 'Kling動画生成',
    description: 'Kuaishou KlingAI 最先端動画生成',
    type: 'kling_generation',
    category: 'generation',
    icon: '🎬',
    color: '#9C27B0',
    defaultConfig: {
      model: 'kling',
      task_type: 'video_generation',
      version: '2.0',
      mode: 'pro',
      duration: 10,
      aspect_ratio: '16:9',
      cfg_scale: 0.5
    },
    inputs: [
      { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
      { id: 'negative_prompt', name: 'ネガティブプロンプト', type: 'text', required: false },
      { id: 'image_url', name: '開始画像', type: 'image', required: false },
      { id: 'image_tail_url', name: '終了画像', type: 'image', required: false },
      { id: 'duration', name: '長さ（秒）', type: 'select', required: false, options: ['5', '10'] },
      { id: 'aspect_ratio', name: 'アスペクト比', type: 'select', required: false, options: ['16:9', '9:16', '1:1'] },
      { id: 'camera_control', name: 'カメラ制御', type: 'object', required: false }
    ],
    outputs: [
      { id: 'video', name: '生成動画', type: 'video' },
      { id: 'task_id', name: 'タスクID', type: 'text' }
    ]
  },

  // Luma Dream Machine
  {
    id: 'luma_generation',
    name: 'Luma Dream Machine',
    description: 'Luma Labs Dream Machine動画生成',
    type: 'luma_generation',
    category: 'generation',
    icon: '💫',
    color: '#673AB7',
    defaultConfig: {
      model: 'luma',
      task_type: 'video_generation',
      model_name: 'ray-v2',
      duration: 5,
      aspect_ratio: '16:9'
    },
    inputs: [
      { id: 'prompt', name: 'プロンプト', type: 'text', required: true },
      { id: 'frame0', name: '開始フレーム', type: 'image', required: false },
      { id: 'frame1', name: '終了フレーム', type: 'image', required: false },
      { id: 'duration', name: '長さ（秒）', type: 'select', required: false, options: ['5', '10'] },
      { id: 'aspect_ratio', name: 'アスペクト比', type: 'select', required: false, options: ['9:16', '3:4', '1:1', '4:3', '16:9', '21:9'] }
    ],
    outputs: [
      { id: 'video', name: '生成動画', type: 'video' }
    ]
  },

  // Music Generation (Suno + Udio)
  {
    id: 'music_generation',
    name: '音楽生成',
    description: 'Suno・Udio音楽生成',
    type: 'music_generation',
    category: 'generation',
    icon: '🎵',
    color: '#00BCD4',
    defaultConfig: {
      model: 'music-u',
      task_type: 'generate_music',
      lyrics_type: 'generate',
      platform: 'Suno'
    },
    inputs: [
      { id: 'prompt', name: '音楽プロンプト', type: 'text', required: true },
      { id: 'negative_tags', name: '除外タグ', type: 'text', required: false },
      { id: 'gpt_description_prompt', name: 'GPT説明プロンプト', type: 'text', required: false },
      { id: 'lyrics_type', name: '歌詞タイプ', type: 'select', required: false, options: ['generate', 'user', 'instrumental'] },
      { id: 'lyrics', name: 'カスタム歌詞', type: 'text', required: false },
      { id: 'seed', name: 'シード', type: 'number', required: false }
    ],
    outputs: [
      { id: 'audio', name: '生成音楽', type: 'audio' }
    ]
  },

  // TTS (Text-to-Speech)
  {
    id: 'tts_generation',
    name: '音声合成',
    description: 'ゼロショット音声クローニング・音声合成',
    type: 'tts_generation',
    category: 'generation',
    icon: '🗣️',
    color: '#4CAF50',
    defaultConfig: {
      model: 'Qubico/tts',
      task_type: 'zero-shot'
    },
    inputs: [
      { id: 'gen_text', name: '音声化テキスト', type: 'text', required: true },
      { id: 'ref_audio', name: '参照音声', type: 'audio', required: true },
      { id: 'ref_text', name: '参照音声テキスト', type: 'text', required: false }
    ],
    outputs: [
      { id: 'audio', name: '合成音声', type: 'audio' }
    ]
  },

  // Face Swap
  {
    id: 'face_swap',
    name: '顔交換',
    description: '画像内の顔を交換',
    type: 'face_swap',
    category: 'generation',
    icon: '👤',
    color: '#795548',
    defaultConfig: {
      model: 'Qubico/image-toolkit',
      task_type: 'face-swap',
      max_resolution: '2048x2048'
    },
    inputs: [
      { id: 'target_image', name: '対象画像', type: 'image', required: true },
      { id: 'swap_image', name: '交換用顔画像', type: 'image', required: true }
    ],
    outputs: [
      { id: 'result_image', name: '結果画像', type: 'image' }
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