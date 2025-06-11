import axios from 'axios';

// PiAPI設定（piapi.yaml準拠）
const PIAPI_BASE_URL = 'https://api.piapi.ai';
const PIAPI_KEY = 'c53e4ef1f0db3d7650c894c9dd77ed88f4a7efef37b728b2a619525c7e716fe8';

// バックエンドAPI設定
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

// 統一APIエンドポイント
const UNIFIED_ENDPOINTS = {
  CREATE_TASK: '/api/v1/task',
  GET_TASK: '/api/v1/task'
};

// モデル・タスクタイプ定義（piapi.yaml準拠）
export const PIAPI_MODELS = {
  // 画像生成
  MIDJOURNEY: 'midjourney',
  FLUX_SCHNELL: 'Qubico/flux1-schnell',
  FLUX_DEV: 'Qubico/flux1-dev',
  FLUX_DEV_ADVANCED: 'Qubico/flux1-dev-advanced',
  
  // 動画生成
  KLING: 'kling',
  LUMA: 'luma',
  HUNYUAN: 'Qubico/hunyuan',
  HAILUO: 'hailuo',
  SKYREELS: 'Qubico/skyreels',
  WANX: 'Qubico/wanx',
  
  // 音楽生成
  MUSIC: 'music-u',
  
  // 顔交換
  FACESWAP: 'Qubico/image-toolkit',
  
  // 音声合成
  TTS: 'Qubico/tts'
} as const;

export const TASK_TYPES = {
  // Midjourney
  MJ_IMAGINE: 'imagine',
  MJ_UPSCALE: 'upscale',
  MJ_BLEND: 'blend',
  MJ_PAN: 'pan',
  MJ_INPAINT: 'inpaint',
  MJ_OUTPAINT: 'outpaint',
  
  // Flux
  FLUX_TXT2IMG: 'txt2img',
  FLUX_IMG2IMG: 'img2img',
  FLUX_TXT2IMG_LORA: 'txt2img-lora',
  FLUX_IMG2IMG_LORA: 'img2img-lora',
  FLUX_FILL_INPAINT: 'fill-inpaint',
  FLUX_FILL_OUTPAINT: 'fill-outpaint',
  FLUX_REDUX_VARIATION: 'redux-variation',
  FLUX_CONTROLNET_LORA: 'controlnet-lora',
  
  // 動画生成
  VIDEO_GENERATION: 'video_generation',
  EXTEND_VIDEO: 'extend_video',
  
  // Kling特有
  KLING_LIP_SYNC: 'lip_sync',
  KLING_EFFECTS: 'effects',
  KLING_VIRTUAL_TRY_ON: 'virtual-try-on',
  
  // 音楽
  GENERATE_MUSIC: 'generate_music',
  GENERATE_MUSIC_CUSTOM: 'generate_music_custom',
  
  // 顔交換
  FACE_SWAP: 'face-swap',
  MULTI_FACE_SWAP: 'multi-face-swap',
  VIDEO_FACE_SWAP: 'video-face-swap',
  
  // 音声
  TTS_ZERO_SHOT: 'zero-shot'
} as const;

// リクエスト型定義
export interface PiAPIUnifiedRequest {
  model: string;
  task_type: string;
  input: {
    prompt?: string;
    negative_prompt?: string;
    aspect_ratio?: string;
    width?: number;
    height?: number;
    duration?: number;
    guidance_scale?: number;
    process_mode?: 'relax' | 'fast' | 'turbo';
    image_url?: string;
    image_urls?: string[];
    target_image?: string;
    swap_image?: string;
    gen_text?: string;
    ref_audio?: string;
    ref_text?: string;
    [key: string]: any;
  };
  config?: {
    service_mode?: 'public' | 'private';
    webhook_config?: {
      endpoint: string;
      secret: string;
    };
  };
}

export interface PiAPIResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: {
    images?: Array<{
      url: string;
      thumbnail?: string;
    }>;
    videos?: Array<{
      url: string;
      thumbnail?: string;
    }>;
    audios?: Array<{
      url: string;
    }>;
    url?: string;
    thumbnail?: string;
    metadata?: any;
  };
  error?: string;
  progress?: number;
  created_at?: string;
  updated_at?: string;
}

// 従来インターフェース用の型定義
export interface GenerationRequest {
  prompt: string;
  model: string;
  aspectRatio?: string;
  resolution?: string;
  duration?: string;
  style?: string;
  seed?: number;
  steps?: number;
  guidance?: number;
  sourceImage?: string;
  targetImage?: string;
  options?: {
    size?: string;
    duration?: number;
    [key: string]: any;
  };
}

export interface GenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: {
    url: string;
    thumbnail?: string;
    metadata?: any;
  };
  error?: string;
  progress?: number;
}

// モデル情報の型定義
export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  type: 'image' | 'video' | 'music' | 'faceswap';
  category: string;
}

export class PiAPIService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = PIAPI_KEY;
    this.baseURL = PIAPI_BASE_URL;
  }

  // 利用可能なモデル一覧を取得
  getAvailableModels(): ModelInfo[] {
    return [
      // 画像生成モデル
      {
        id: PIAPI_MODELS.MIDJOURNEY,
        name: 'Midjourney',
        description: '高品質なアートスタイル画像生成',
        type: 'image',
        category: 'premium'
      },
      {
        id: PIAPI_MODELS.FLUX_SCHNELL,
        name: 'Flux Schnell',
        description: '高速画像生成モデル',
        type: 'image',
        category: 'fast'
      },
      {
        id: PIAPI_MODELS.FLUX_DEV,
        name: 'Flux Dev',
        description: '高品質画像生成モデル',
        type: 'image',
        category: 'quality'
      },
      {
        id: PIAPI_MODELS.FLUX_DEV_ADVANCED,
        name: 'Flux Dev Advanced',
        description: '最高品質画像生成モデル',
        type: 'image',
        category: 'premium'
      },
      
      // 動画生成モデル
      {
        id: PIAPI_MODELS.KLING,
        name: 'Kling AI',
        description: '高品質動画生成エンジン',
        type: 'video',
        category: 'premium'
      },
      {
        id: PIAPI_MODELS.LUMA,
        name: 'Luma Dream Machine',
        description: 'プロフェッショナル動画生成',
        type: 'video',
        category: 'quality'
      },
      {
        id: PIAPI_MODELS.HUNYUAN,
        name: 'Hunyuan Video',
        description: '中国発の動画生成AI',
        type: 'video',
        category: 'standard'
      },
      {
        id: PIAPI_MODELS.HAILUO,
        name: 'Hailuo AI',
        description: '高速動画生成',
        type: 'video',
        category: 'fast'
      },
      
      // 音楽生成モデル
      {
        id: PIAPI_MODELS.MUSIC,
        name: 'Music Generator',
        description: 'AI音楽・楽曲生成',
        type: 'music',
        category: 'standard'
      },
      
      // 顔交換モデル
      {
        id: PIAPI_MODELS.FACESWAP,
        name: 'Face Swap',
        description: '高精度顔交換技術',
        type: 'faceswap',
        category: 'standard'
      }
    ];
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'X-API-Key': this.apiKey, // Legacy APIs用
      'Content-Type': 'application/json'
    };
  }

  // 統一API経由での生成
  async createTask(request: PiAPIUnifiedRequest): Promise<PiAPIResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}${UNIFIED_ENDPOINTS.CREATE_TASK}`,
        request,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('PiAPI unified request failed:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'PiAPI統合タスク作成に失敗しました'
      );
    }
  }

  // タスク状況取得
  async getTask(taskId: string): Promise<PiAPIResponse> {
    try {
      const response = await axios.get(
        `${this.baseURL}${UNIFIED_ENDPOINTS.GET_TASK}/${taskId}`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error: any) {
      console.error('PiAPI task status failed:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'タスク状況取得に失敗しました'
      );
    }
  }

  // Midjourney画像生成
  async generateMidjourneyImage(request: {
    prompt: string;
    aspect_ratio?: string;
    process_mode?: 'relax' | 'fast' | 'turbo';
  }): Promise<PiAPIResponse> {
    const piApiRequest: PiAPIUnifiedRequest = {
      model: PIAPI_MODELS.MIDJOURNEY,
      task_type: TASK_TYPES.MJ_IMAGINE,
      input: {
        prompt: request.prompt,
        aspect_ratio: request.aspect_ratio || '1:1',
        process_mode: request.process_mode || 'fast',
        skip_prompt_check: false
      }
    };

    return this.createTask(piApiRequest);
  }

  // Flux画像生成
  async generateFluxImage(request: {
    prompt: string;
    negative_prompt?: string;
    width?: number;
    height?: number;
    guidance_scale?: number;
    model?: 'schnell' | 'dev' | 'dev-advanced';
  }): Promise<PiAPIResponse> {
    const modelMap = {
      'schnell': PIAPI_MODELS.FLUX_SCHNELL,
      'dev': PIAPI_MODELS.FLUX_DEV,
      'dev-advanced': PIAPI_MODELS.FLUX_DEV_ADVANCED
    };

    const piApiRequest: PiAPIUnifiedRequest = {
      model: modelMap[request.model || 'dev'],
      task_type: TASK_TYPES.FLUX_TXT2IMG,
      input: {
        prompt: request.prompt,
        negative_prompt: request.negative_prompt,
        width: request.width || 1024,
        height: request.height || 1024,
        guidance_scale: request.guidance_scale || 3.5
      }
    };

    return this.createTask(piApiRequest);
  }

  // Kling動画生成
  async generateKlingVideo(request: {
    prompt: string;
    negative_prompt?: string;
    duration?: 5 | 10;
    aspect_ratio?: string;
    version?: '1.0' | '1.5' | '1.6' | '2.0';
    mode?: 'std' | 'pro';
    image_url?: string;
  }): Promise<PiAPIResponse> {
    const piApiRequest: PiAPIUnifiedRequest = {
      model: PIAPI_MODELS.KLING,
      task_type: TASK_TYPES.VIDEO_GENERATION,
      input: {
        prompt: request.prompt,
        negative_prompt: request.negative_prompt,
        duration: request.duration || 5,
        aspect_ratio: request.aspect_ratio || '16:9',
        version: request.version || '2.0',
        mode: request.mode || 'std',
        image_url: request.image_url,
        cfg_scale: 0.5
      }
    };

    return this.createTask(piApiRequest);
  }

  // Luma動画生成
  async generateLumaVideo(request: {
    prompt: string;
    key_frames?: {
      frame0?: { url: string };
      frame1?: { url: string };
    };
    duration?: 5 | 10;
    aspect_ratio?: string;
    model_name?: 'ray-v1' | 'ray-v2';
  }): Promise<PiAPIResponse> {
    const piApiRequest: PiAPIUnifiedRequest = {
      model: PIAPI_MODELS.LUMA,
      task_type: TASK_TYPES.VIDEO_GENERATION,
      input: {
        prompt: request.prompt,
        key_frames: request.key_frames,
        duration: request.duration || 5,
        aspect_ratio: request.aspect_ratio || '16:9',
        model_name: request.model_name || 'ray-v2'
      }
    };

    return this.createTask(piApiRequest);
  }

  // Suno音楽生成
  async generateMusic(request: {
    prompt: string;
    negative_tags?: string;
    lyrics_type?: 'generate' | 'user' | 'instrumental';
    lyrics?: string;
    gpt_description_prompt?: string;
  }): Promise<PiAPIResponse> {
    const piApiRequest: PiAPIUnifiedRequest = {
      model: PIAPI_MODELS.MUSIC,
      task_type: TASK_TYPES.GENERATE_MUSIC,
      input: {
        prompt: request.prompt,
        negative_tags: request.negative_tags,
        gpt_description_prompt: request.gpt_description_prompt,
        lyrics_type: request.lyrics_type || 'generate',
        lyrics: request.lyrics
      }
    };

    return this.createTask(piApiRequest);
  }

  // 顔交換
  async generateFaceSwap(request: {
    target_image: string;
    swap_image: string;
    multi_face?: boolean;
  }): Promise<PiAPIResponse> {
    const piApiRequest: PiAPIUnifiedRequest = {
      model: PIAPI_MODELS.FACESWAP,
      task_type: request.multi_face ? TASK_TYPES.MULTI_FACE_SWAP : TASK_TYPES.FACE_SWAP,
      input: {
        target_image: request.target_image,
        swap_image: request.swap_image
      }
    };

    return this.createTask(piApiRequest);
  }

  // 音声合成（TTS）
  async generateTTS(request: {
    gen_text: string;
    ref_audio: string;
    ref_text?: string;
  }): Promise<PiAPIResponse> {
    const piApiRequest: PiAPIUnifiedRequest = {
      model: PIAPI_MODELS.TTS,
      task_type: TASK_TYPES.TTS_ZERO_SHOT,
      input: {
        gen_text: request.gen_text,
        ref_audio: request.ref_audio,
        ref_text: request.ref_text
      }
    };

    return this.createTask(piApiRequest);
  }

  // PromptAreaコンポーネント用の汎用生成メソッド
  async generateContent(request: GenerationRequest): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const result = await this.generate(request);
      return {
        success: true,
        data: result.result
      };
    } catch (error: any) {
      console.error('Content generation failed:', error);
      return {
        success: false,
        error: error.message || 'コンテンツの生成に失敗しました'
      };
    }
  }

  // バックエンド経由での生成（推奨）
  async generateViaBackend(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/content/piapi/generate/`,
        request,
        { headers }
      );

      return response.data;
    } catch (error: any) {
      console.error('Backend generation failed:', error);
      throw new Error(
        error.response?.data?.message || 
        'バックエンド経由の生成に失敗しました'
      );
    }
  }

  // 従来インターフェース互換の汎用生成メソッド
  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    // バックエンド経由を優先
    try {
      return await this.generateViaBackend(request);
    } catch (error) {
      console.warn('Backend generation failed, trying direct PiAPI...');
      
      // フォールバック: PiAPI統一API直接呼び出し
      try {
        let piApiResponse: PiAPIResponse;

        switch (request.model) {
          case 'midjourney':
            piApiResponse = await this.generateMidjourneyImage({
              prompt: request.prompt,
              aspect_ratio: request.aspectRatio
            });
            break;

          case 'flux':
            piApiResponse = await this.generateFluxImage({
              prompt: request.prompt,
              width: parseInt(request.resolution?.split('x')[0] || '1024'),
              height: parseInt(request.resolution?.split('x')[1] || '1024')
            });
            break;

          case 'kling':
            piApiResponse = await this.generateKlingVideo({
              prompt: request.prompt,
              duration: parseInt(request.duration || '5') as 5 | 10,
              aspect_ratio: request.aspectRatio
            });
            break;

          case 'luma':
          case 'dream_machine':
            piApiResponse = await this.generateLumaVideo({
              prompt: request.prompt,
              duration: parseInt(request.duration || '5') as 5 | 10,
              aspect_ratio: request.aspectRatio
            });
            break;

          case 'suno':
            piApiResponse = await this.generateMusic({
              prompt: request.prompt
            });
            break;

          case 'faceswap':
            if (!request.sourceImage || !request.targetImage) {
              throw new Error('顔交換には元画像と対象画像が必要です');
            }
            piApiResponse = await this.generateFaceSwap({
              target_image: request.targetImage,
              swap_image: request.sourceImage
            });
            break;

          default:
            throw new Error(`サポートされていないモデル: ${request.model}`);
        }

        // PiAPIレスポンスを従来形式に変換
        return this.convertPiAPIResponse(piApiResponse);
      } catch (directError) {
        console.error('Direct PiAPI call failed:', directError);
        throw directError;
      }
    }
  }

  // PiAPIレスポンスを従来形式に変換
  private convertPiAPIResponse(piApiResponse: PiAPIResponse): GenerationResponse {
    const result = piApiResponse.result;
    let url = '';

    if (result?.images?.[0]?.url) {
      url = result.images[0].url;
    } else if (result?.videos?.[0]?.url) {
      url = result.videos[0].url;
    } else if (result?.audios?.[0]?.url) {
      url = result.audios[0].url;
    } else if (result?.url) {
      url = result.url;
    }

    return {
      id: piApiResponse.id,
      status: piApiResponse.status,
      result: url ? {
        url,
        thumbnail: result?.images?.[0]?.thumbnail || result?.videos?.[0]?.thumbnail || result?.thumbnail,
        metadata: result?.metadata
      } : undefined,
      error: piApiResponse.error,
      progress: piApiResponse.progress
    };
  }

  // ポーリングによる完了待ち
  async waitForCompletion(id: string, maxAttempts = 30, interval = 2000): Promise<GenerationResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const piApiResponse = await this.getTask(id);
        const response = this.convertPiAPIResponse(piApiResponse);
        
        if (response.status === 'completed' || response.status === 'failed') {
          return response;
        }
        
        await new Promise(resolve => setTimeout(resolve, interval));
      } catch (error) {
        console.error(`Status check attempt ${attempt + 1} failed:`, error);
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
    
    throw new Error('生成がタイムアウトしました');
  }
}

export const piApiService = new PiAPIService(); 