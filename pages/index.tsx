import React, { useState, useEffect, useRef } from 'react';
import { NextSeo } from 'next-seo';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Add as AddIcon,
  Image as ImageIcon,
  VideoCall as VideoIcon,
  AudioFile as AudioIcon,
  Face as FaceIcon,
  ThreeDRotation as Model3DIcon,
  Send as SendIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  PlayArrow as PlayIcon,
  Settings as SettingsIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Psychology as WorkflowIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { WorkflowEditor } from '../components/workflow/WorkflowEditor';
import { ModelSelector } from '../components/ai/ModelSelector';
import { ApiDebugInfo } from '../components/debug/ApiDebugInfo';
import { AIModel } from '../constants/aiModels';
import { mockApi, shouldUseMockApi } from '../utils/mockApi';

// テーマ設定
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(0, 0, 0, 0.9)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.8)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '12px',
            color: '#ffffff',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#667eea',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.8)',
            '&.Mui-focused': {
              color: '#667eea',
            },
          },
        },
      },
    },
  },
});

// 利用可能なビデオファイル
const availableVideos = [
  { id: 'deepia2', name: 'Deepia2 デフォルト', path: '/deepia2.mp4' },
  { id: 'deepia2-2', name: 'Deepia2 バリエーション 2', path: '/deepia2-2.mp4' },
  { id: 'deepia2-3', name: 'Deepia2 バリエーション 3', path: '/deepia2-3.mp4' },
  { id: 'deepia2-4', name: 'Deepia2 バリエーション 4', path: '/deepia2-4.mp4' },
  { id: 'depia2-6', name: 'Deepia2 バリエーション 6', path: '/depia2-6.mp4' },
  { id: 'cat', name: 'Cat Animation', path: '/cat.mp4' },
];

// AI生成タイプ
const contentTypes = [
  { id: 'image', name: 'イメージ生成', icon: <ImageIcon />, color: '#667eea' },
  { id: 'video', name: 'ビデオ生成', icon: <VideoIcon />, color: '#764ba2' },
  { id: 'audio', name: 'オーディオ生成', icon: <AudioIcon />, color: '#f093fb' },
  { id: 'faceswap', name: 'フェイススワップ', icon: <FaceIcon />, color: '#4facfe' },
];

interface Content {
  id: number;
  title: string;
  prompt: string;
  content_type: string;
  image_url?: string;
  created_at: string;
  user: number;
  likes: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
}

const Home = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedType, setSelectedType] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showVideoSelector, setShowVideoSelector] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(availableVideos[0]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showWorkflowEditor, setShowWorkflowEditor] = useState(false);
  
  // AI生成関連の状態
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'image' | 'video' | 'audio' | '3d'>('image');
  const [currentGenerationTask, setCurrentGenerationTask] = useState<any>(null);
  
  // デバッグ関連の状態
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [debugError, setDebugError] = useState<any>(null);
  const [debugRequestData, setDebugRequestData] = useState<any>(null);
  const [debugResponseData, setDebugResponseData] = useState<any>(null);
  
  // 認証関連の状態
  const [user, setUser] = useState<User | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState(0); // 0: ログイン, 1: 登録
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // APIクライアント（コンポーネント内で定義してstateにアクセス可能にする）
  const apiClient = {
    baseURL: 'http://localhost:9000',
    
    async request(endpoint: string, options: RequestInit = {}) {
      // モックAPIを使用するかチェック
      if (shouldUseMockApi()) {
        console.log('Using Mock API for:', endpoint);
        return this.handleMockRequest(endpoint, options);
      }

      const url = `${this.baseURL}${endpoint}`;
      console.log('API Request URL:', url);
      console.log('API Request Options:', options);
      
      // JWTトークンがある場合は追加
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...options.headers,
        },
        ...options,
      };

      // リクエストボディをログ出力
      if (config.body) {
        console.log('API Request Body:', config.body);
      }

      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = await response.text();
          }
          console.error(`API Error ${response.status}:`, errorData);
          throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        return data;
      } catch (error) {
        console.error('Request failed:', error);
        
        // デバッグ情報を保存
        setDebugError(error);
        setDebugRequestData({ endpoint, options });
        setDebugResponseData(null);
        
        throw error;
      }
    },

    async handleMockRequest(endpoint: string, options: RequestInit = {}) {
      try {
        const method = options.method || 'GET';
        const body = options.body ? JSON.parse(options.body as string) : null;

        switch (endpoint) {
          case '/api/content/':
            if (method === 'GET') {
              return await mockApi.getContents();
            } else if (method === 'POST') {
              return await mockApi.createContent(body);
            }
            break;
          
          case '/api/auth/login/':
            if (method === 'POST') {
              return await mockApi.login(body);
            }
            break;
          
          case '/api/auth/register/':
            if (method === 'POST') {
              return await mockApi.register(body);
            }
            break;
          
          default:
            if (endpoint.startsWith('/api/auth/verify/')) {
              const urlParts = endpoint.split('/');
              const token = urlParts[urlParts.length - 2];
              const userId = new URLSearchParams(endpoint.split('?')[1] || '').get('user_id');
              return await mockApi.verifyEmail(token, parseInt(userId || '1'));
            }
            break;
        }

        throw new Error(`Mock API: Endpoint not implemented: ${endpoint}`);
      } catch (error) {
        console.error('Mock API Error:', error);
        throw error;
      }
    },

    // コンテンツ関連API
    async getContents() {
      return this.request('/api/content/');
    },

    async createContent(data: any) {
      return this.request('/api/content/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async deleteContent(id: number) {
      return this.request(`/api/content/${id}/`, {
        method: 'DELETE',
      });
    },

    // 認証関連API
    async register(data: any) {
      return this.request('/api/auth/register/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async login(data: any) {
      return this.request('/api/auth/login/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async verifyEmail(token: string, userId: string) {
      return this.request(`/api/auth/verify/${token}/?user_id=${userId}`);
    },
  };

  // 初期データ読み込み
  useEffect(() => {
    loadContents();
    // ローカルストレージからユーザー情報を復元
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loadContents = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getContents();
      // APIから返されたデータを適切な形式に変換
      const formattedContents = data.map((item: any) => ({
        id: item.id,
        title: item.title || `Content ${item.id}`,
        prompt: item.prompt,
        content_type: item.content_type || getContentTypeFromCategory(item.category_id),
        image_url: item.deliverables && item.deliverables.startsWith('http') ? item.deliverables : null,
        created_at: item.created_at,
        user: item.user || 1,
        likes: item.likes || 0,
      }));
      setContents(formattedContents);
    } catch (error) {
      console.error('Failed to load contents:', error);
      showMessage('コンテンツの読み込みに失敗しました', 'error');
      // エラー時は空配列を設定
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  const getContentTypeFromCategory = (categoryId: number) => {
    const categoryMap: { [key: number]: string } = {
      0: 'image',
      1: 'text',
      2: 'music',
      3: 'video',
      4: 'space'
    };
    return categoryMap[categoryId] || 'image';
  };

  const showMessage = (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // AI生成処理
  const handleAIGeneration = async (model: AIModel, parameters: Record<string, any>, taskType: string) => {
    try {
      setCreating(true);
      setCurrentGenerationTask({ model, parameters, taskType });
      
      showMessage(`${model.name}で生成を開始しています...`, 'info');
      
      // piapi.yamlに基づいたリクエストを作成
      const requestData = {
        model: model.id,
        task_type: taskType,
        input: parameters,
        config: {
          service_mode: 'public' // デフォルトでPay-as-you-goモード
        }
      };
      
      console.log('AI Generation Request:', requestData);
      
      // モックAPIまたは開発環境では直接DeepiaAPIを使用、本番環境ではPiAPIを使用
      let response;
      if (shouldUseMockApi() || process.env.NODE_ENV === 'development') {
        // DeepiaAPIでシミュレーション（モックAPIを含む）
        response = await apiClient.createContent({
          title: parameters.prompt?.substring(0, 50) + '...' || `${model.name}生成コンテンツ`,
          prompt: parameters.prompt || '',
          content_type: model.category,
          ai_model: model.id,
          ai_task_type: taskType,
          ai_parameters: JSON.stringify(parameters),
          user_id: user?.id
        });
        
        setContents([response, ...contents]);
        showMessage(`${model.name}での生成が完了しました！`, 'success');
      } else {
        // 本番環境でPiAPI呼び出し
        const piApiResponse = await fetch('https://api.piapi.ai/api/v1/task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PIAPI_KEY || 'YOUR_API_KEY'}`,
          },
          body: JSON.stringify(requestData)
        });
        
        if (!piApiResponse.ok) {
          throw new Error(`PiAPI Error: ${piApiResponse.status}`);
        }
        
        const taskResult = await piApiResponse.json();
        console.log('AI Generation Response:', taskResult);
        
        // 生成結果をコンテンツとして保存
        if (taskResult.task_id) {
          const newContent = await apiClient.createContent({
            title: parameters.prompt?.substring(0, 50) + '...' || `${model.name}生成コンテンツ`,
            prompt: parameters.prompt || '',
            content_type: model.category,
            ai_model: model.id,
            ai_task_id: taskResult.task_id,
            ai_parameters: JSON.stringify(parameters),
            user_id: user?.id
          });
          
          setContents([newContent, ...contents]);
          showMessage(`${model.name}での生成が完了しました！`, 'success');
        }
      }
      
    } catch (error) {
      console.error('AI Generation failed:', error);
      showMessage(`AI生成に失敗しました: ${error}`, 'error');
      
      // エラー時もデバッグ情報を表示
      setTimeout(() => {
        if (confirm('AI生成エラーの詳細情報を表示しますか？')) {
          setDebugError(error);
          setDebugRequestData({ model: model.id, parameters, taskType });
          setDebugResponseData(null);
          setShowDebugInfo(true);
        }
      }, 1000);
    } finally {
      setCreating(false);
      setCurrentGenerationTask(null);
    }
  };

  const handleCreateContent = async () => {
    if (!user) {
      showMessage('コンテンツを作成するにはログインが必要です', 'error');
      setShowAuthDialog(true);
      return;
    }

    if (!prompt.trim() || !title.trim()) {
      showMessage('タイトルとプロンプトを入力してください', 'error');
      return;
    }

    try {
      setCreating(true);
      const newContent = await apiClient.createContent({
        title,
        prompt,
        content_type: selectedType,
        user_id: user.id,
      });

      setContents([newContent, ...contents]);
      setPrompt('');
      setTitle('');
      showMessage('コンテンツが作成されました！');
    } catch (error) {
      console.error('Failed to create content:', error);
      showMessage('コンテンツの作成に失敗しました。詳細を確認しますか？', 'error');
      
      // デバッグ情報を表示するオプション
      setTimeout(() => {
        if (confirm('APIエラーの詳細情報を表示しますか？')) {
          setShowDebugInfo(true);
        }
      }, 2000);
    } finally {
      setCreating(false);
    }
  };

  // 認証が必要な機能かどうかを判断
  const requiresAuth = (action: string) => {
    const authRequiredActions = ['save', 'share', 'upload', 'follow', 'like', 'comment', 'workflow_save'];
    return authRequiredActions.includes(action);
  };

  // 認証が必要な機能にアクセスする際のチェック
  const checkAuthAndExecute = (action: string, callback: () => void) => {
    if (requiresAuth(action) && !user) {
      setShowAuthDialog(true);
      showMessage('この機能を使用するにはログインが必要です', 'info');
      return;
    }
    callback();
  };

  // ユーザー認証後の処理
  const onAuthSuccess = (userData: any, token: string, isLogin: boolean) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setShowAuthDialog(false);
    
    // 認証フォームをリセット
    setAuthData({ name: '', email: '', password: '' });
    
    const message = isLogin ? 'ログインしました！' : 'アカウントが作成されました！';
    showMessage(message + '全ての機能がご利用いただけます。', 'success');
    
    // 認証後にコンテンツを再読み込み（認証済みユーザー向けコンテンツも含める）
    loadContents();
  };

  const handleAuth = async () => {
    try {
      if (authTab === 0) {
        // ログイン
        const response = await apiClient.login({
          email: authData.email,
          password: authData.password,
        });
        
        if (response.token) {
          const userData = { 
            id: response.user?.id || Date.now(), 
            email: authData.email, 
            name: response.user?.name || authData.email.split('@')[0],
            avatar: response.user?.avatar || null
          };
          onAuthSuccess(userData, response.token, true);
        }
      } else {
        // 登録
        const response = await apiClient.register({
          name: authData.name,
          email: authData.email,
          password: authData.password,
        });
        
        showMessage(response.message);
        if (response.verification_url) {
          // 開発環境では自動認証
          setTimeout(async () => {
            try {
              const verifyResponse = await apiClient.verifyEmail('dummy', response.user_id);
              const userData = {
                id: verifyResponse.user?.id || response.user_id,
                name: authData.name,
                email: authData.email,
                avatar: verifyResponse.user?.avatar || null
              };
              onAuthSuccess(userData, verifyResponse.token, false);
            } catch (error) {
              console.error('Auto verification failed:', error);
              showMessage('認証に失敗しました。再度お試しください。', 'error');
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Auth failed:', error);
      showMessage(authTab === 0 ? 'ログインに失敗しました' : '登録に失敗しました', 'error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    showMessage('ログアウトしました');
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, content: Content) => {
    setAnchorEl(event.currentTarget);
    setSelectedContent(content);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContent(null);
  };

  const handleDeleteContent = async () => {
    if (!selectedContent) return;

    try {
      await apiClient.deleteContent(selectedContent.id);
      setContents(contents.filter(c => c.id !== selectedContent.id));
      showMessage('コンテンツが削除されました');
      handleMenuClose();
    } catch (error) {
      console.error('Failed to delete content:', error);
      showMessage('削除に失敗しました', 'error');
    }
  };

  const handleVideoChange = (video: typeof availableVideos[0]) => {
    setCurrentVideo(video);
    setShowVideoSelector(false);
    // ビデオを再読み込み
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          backgroundColor: '#000',
        }}
      >
        {/* 背景ビデオ */}
        <Box
          component="video"
          ref={videoRef}
          autoPlay
          muted
          loop
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            zIndex: 1,
          }}
        >
          <source src={currentVideo.path} type="video/mp4" />
        </Box>

        {/* 左上のタイトル */}
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            left: 20,
            zIndex: 1000,
            color: 'white',
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Deepia2
          </Typography>
        </Box>

        {/* 右上のメニュー */}
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1000,
            display: 'flex',
            gap: 1,
          }}
        >
          {/* ワークフロー編集ボタン */}
          <IconButton
            onClick={() => setShowWorkflowEditor(true)}
            sx={{
              backgroundColor: 'rgba(102, 126, 234, 0.8)',
              color: 'white',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.9)',
              },
            }}
          >
            <WorkflowIcon />
          </IconButton>

          {/* ビデオ選択ボタン */}
          <IconButton
            onClick={() => setShowVideoSelector(true)}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
              },
            }}
          >
            <SettingsIcon />
          </IconButton>

          {/* ユーザー設定アイコン */}
          {user && (
            <IconButton
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
              }}
            >
              <AccountCircleIcon />
            </IconButton>
          )}

          {/* 認証状態表示 */}
          {user ? (
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderRadius: '20px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Avatar 
                  src={user.avatar} 
                  sx={{ width: 24, height: 24 }}
                >
                  {user.name?.charAt(0) || 'U'}
                </Avatar>
                <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem' }}>
                  {user.name || user.email}
                </Typography>
              </Box>
              <IconButton
                onClick={handleLogout}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          ) : (
            <IconButton
              onClick={() => setShowAuthDialog(true)}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
              }}
            >
              <LoginIcon />
            </IconButton>
          )}
        </Box>

        <NextSeo
          title="Deepia2 - AI Creative Studio"
          description="AIを使ってあらゆるコンテンツを生成するクリエイティブプラットフォーム"
        />

        <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 100 }}>
          {/* コンテンツ作成フォーム - 常に表示 */}
          <Card 
            sx={{ 
              mb: 6, 
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
                <Grid container spacing={2} mb={3}>
                  {contentTypes.map((type) => (
                    <Grid item xs={6} sm={3} key={type.id}>
                      <Chip
                        icon={type.icon}
                        label={type.name}
                        clickable
                        color={selectedType === type.id ? 'primary' : 'default'}
                        variant={selectedType === type.id ? 'filled' : 'outlined'}
                        onClick={() => setSelectedType(type.id)}
                        sx={{
                          width: '100%',
                          height: 48,
                          color: 'white',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          backgroundColor: selectedType === type.id ? type.color : 'transparent',
                          '&:hover': {
                            backgroundColor: selectedType === type.id ? type.color : 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* AI生成ボタン */}
                <Box display="flex" gap={1} mb={3}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedCategory('image');
                      setShowModelSelector(true);
                    }}
                    startIcon={<ImageIcon />}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    AI画像生成
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedCategory('video');
                      setShowModelSelector(true);
                    }}
                    startIcon={<VideoIcon />}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    AI動画生成
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedCategory('audio');
                      setShowModelSelector(true);
                    }}
                    startIcon={<AudioIcon />}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    AI音楽生成
                  </Button>
                </Box>

                {/* タイトル入力 */}
                <TextField
                  fullWidth
                  label="タイトル"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ mb: 3 }}
                />

                {/* プロンプト入力 */}
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="プロンプト（生成したいコンテンツの説明）"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  sx={{ mb: 3 }}
                />

                {/* アクションボタン */}
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={creating ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    onClick={() => checkAuthAndExecute('save', handleCreateContent)}
                    disabled={creating || !prompt.trim() || !title.trim()}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                      },
                    }}
                  >
                    {creating ? '作成中...' : user ? '作成' : '作成（ログインが必要）'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setPrompt('');
                      setTitle('');
                    }}
                    disabled={creating}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '12px',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    クリア
                  </Button>
                </Box>
            </CardContent>
          </Card>

          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress size={60} sx={{ color: 'white' }} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {contents.map((content) => (
                <Grid item xs={12} sm={6} md={4} key={content.id}>
                  <Card
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                      },
                    }}
                  >
                    <Box position="relative">
                      {content.image_url ? (
                        <Box
                          component="img"
                          src={content.image_url}
                          alt={content.title}
                          sx={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: 200,
                            bgcolor: 'rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            color: 'white',
                            borderTopLeftRadius: '16px',
                            borderTopRightRadius: '16px',
                          }}
                        >
                          {contentTypes.find(t => t.id === content.content_type)?.icon || '✨'}
                        </Box>
                      )}
                      <Chip
                        label={contentTypes.find(t => t.id === content.content_type)?.name || content.content_type}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                        }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': { background: 'rgba(255, 255, 255, 0.9)' },
                        }}
                        onClick={(e) => handleMenuClick(e, content)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" color="white" mb={1}>
                        {content.title}
                      </Typography>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.8)" mb={2}>
                        &quot;{content.prompt}&quot;
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" gap={1}>
                          <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            <FavoriteIcon fontSize="small" />
                            <Typography variant="caption" ml={0.5}>
                              {content.likes || 0}
                            </Typography>
                          </IconButton>
                          <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            <ShareIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              {contents.length === 0 && !loading && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      borderRadius: '16px',
                      padding: '3rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6" color="white" mb={2}>
                      まだコンテンツがありません
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                      最初のコンテンツを作成しましょう！
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Container>

        {/* メニュー */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>詳細を表示</MenuItem>
          <MenuItem onClick={handleMenuClose}>共有</MenuItem>
          <MenuItem onClick={handleMenuClose}>ダウンロード</MenuItem>
          <MenuItem onClick={handleDeleteContent} sx={{ color: 'error.main' }}>
            削除
          </MenuItem>
        </Menu>

        {/* 認証ダイアログ */}
        <Dialog
          open={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              minWidth: '400px',
            },
          }}
        >
          <DialogTitle sx={{ color: 'white', textAlign: 'center' }}>
            <Tabs value={authTab} onChange={(_, newValue) => setAuthTab(newValue)} centered>
              <Tab label="ログイン" sx={{ color: 'white' }} />
              <Tab label="新規登録" sx={{ color: 'white' }} />
            </Tabs>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {authTab === 1 && (
                <TextField
                  label="名前"
                  value={authData.name}
                  onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                  fullWidth
                />
              )}
              <TextField
                label="メールアドレス"
                type="email"
                value={authData.email}
                onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="パスワード"
                type="password"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleAuth}
                sx={{
                  mt: 2,
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                  },
                }}
              >
                {authTab === 0 ? 'ログイン' : '新規登録'}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* ビデオ選択ダイアログ */}
        <Dialog
          open={showVideoSelector}
          onClose={() => setShowVideoSelector(false)}
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
            },
          }}
        >
          <DialogTitle sx={{ color: 'white', textAlign: 'center' }}>
            背景ビデオを選択
          </DialogTitle>
          <DialogContent>
            <List>
              {availableVideos.map((video) => (
                <ListItem
                  key={video.id}
                  button
                  onClick={() => handleVideoChange(video)}
                  selected={currentVideo.id === video.id}
                  sx={{
                    borderRadius: '12px',
                    mb: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(102, 126, 234, 0.3)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon>
                    <PlayIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={video.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: 'white',
                      },
                    }}
                  />
                  {currentVideo.id === video.id && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#667eea',
                      }}
                    />
                  )}
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>

        {/* スナックバー */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              borderRadius: '12px',
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* ワークフローエディター */}
        <WorkflowEditor
          open={showWorkflowEditor}
          onClose={() => setShowWorkflowEditor(false)}
          apiClient={apiClient}
          user={user}
          onAuthRequired={() => {
            setShowAuthDialog(true);
            showMessage('ワークフローの保存・共有にはログインが必要です', 'info');
          }}
        />

        {/* AIモデル選択ダイアログ */}
        <ModelSelector
          open={showModelSelector}
          onClose={() => setShowModelSelector(false)}
          category={selectedCategory}
          onModelSelect={(model, parameters, taskType) => 
            checkAuthAndExecute('save', () => handleAIGeneration(model, parameters, taskType))
          }
        />

        {/* APIデバッグ情報ダイアログ */}
        <ApiDebugInfo
          open={showDebugInfo}
          onClose={() => setShowDebugInfo(false)}
          error={debugError}
          requestData={debugRequestData}
          responseData={debugResponseData}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Home;