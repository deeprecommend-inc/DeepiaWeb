// 開発環境用モックAPI

export const mockContents = [
  {
    id: 1,
    title: 'AI Generated Landscape',
    prompt: 'Beautiful mountain landscape at sunset',
    content_type: 'image',
    user: 1,
    user_id: 1,
    ai_model: 'midjourney',
    ai_task_type: 'imagine',
    ai_status: 'completed',
    ai_parameters: JSON.stringify({ aspect_ratio: '16:9', style: 'photorealistic' }),
    likes: 5,
    deliverables: 'https://picsum.photos/800/600?random=1',
    category_id: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Digital Art Portrait',
    prompt: 'Futuristic digital art portrait of a cyberpunk character',
    content_type: 'image',
    user: 1,
    user_id: 1,
    ai_model: 'flux_dev',
    ai_task_type: 'generate',
    ai_status: 'completed',
    ai_parameters: JSON.stringify({ style: 'cyberpunk', quality: 'high' }),
    likes: 12,
    deliverables: 'https://picsum.photos/800/600?random=2',
    category_id: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Abstract Animation',
    prompt: 'Flowing abstract shapes with vibrant colors',
    content_type: 'video',
    user: 1,
    user_id: 1,
    ai_model: 'kling',
    ai_task_type: 'text_to_video',
    ai_status: 'completed',
    ai_parameters: JSON.stringify({ duration: 10, style: 'abstract' }),
    likes: 8,
    deliverables: 'https://picsum.photos/800/600?random=3',
    category_id: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Suno AI Music Track',
    prompt: 'Upbeat electronic music with synthesized beats',
    content_type: 'audio',
    user: 1,
    user_id: 1,
    ai_model: 'suno',
    ai_task_type: 'generate_music',
    ai_status: 'completed',
    ai_parameters: JSON.stringify({ genre: 'electronic', duration: 180 }),
    likes: 3,
    deliverables: '',
    category_id: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: 'RunwayML Video Generation',
    prompt: 'Time-lapse of clouds moving over a city skyline',
    content_type: 'video',
    user: 1,
    user_id: 1,
    ai_model: 'runwayml_gen3',
    ai_task_type: 'text_to_video',
    ai_status: 'completed',
    ai_parameters: JSON.stringify({ duration: 5, resolution: '1920x1080' }),
    likes: 15,
    deliverables: 'https://picsum.photos/800/600?random=5',
    category_id: 3,
    created_at: new Date().toISOString()
  }
];

export const mockApi = {
  async getContents() {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return mockContents;
  },

  async createContent(data: any) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate creation time
    
    const newContent = {
      id: Math.floor(Math.random() * 10000),
      title: data.title,
      prompt: data.prompt,
      content_type: data.content_type,
      user: data.user_id,
      user_id: data.user_id,
      ai_model: data.ai_model || null,
      ai_task_type: data.ai_task_type || null,
      ai_parameters: data.ai_parameters || null,
      ai_status: data.ai_model ? 'completed' : null,
      likes: 0,
      deliverables: data.ai_model ? `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}` : '',
      category_id: data.content_type === 'image' ? 0 : data.content_type === 'video' ? 3 : data.content_type === 'audio' ? 2 : 0,
      created_at: new Date().toISOString()
    };

    mockContents.unshift(newContent);
    return newContent;
  },

  async login(credentials: { email: string; password: string }) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: 1,
          name: 'テストユーザー',
          email: credentials.email,
          avatar: null
        }
      };
    } else {
      throw new Error('Invalid credentials');
    }
  },

  async register(userData: { name: string; email: string; password: string }) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      message: 'アカウントが作成されました。認証メールを送信しました。',
      user_id: Math.floor(Math.random() * 10000),
      verification_url: 'mock_verification_url'
    };
  },

  async verifyEmail(token: string, userId: number) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: userId,
        name: 'テストユーザー',
        email: 'test@example.com',
        avatar: null
      }
    };
  }
};

// デバッグ用：実際のAPIか モックAPIかを判定
export const shouldUseMockApi = () => {
  return process.env.NODE_ENV === 'development' && 
         (!process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_USE_MOCK === 'true');
};