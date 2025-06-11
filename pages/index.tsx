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

// APIクライアント
const apiClient = {
  baseURL: 'http://localhost:9000',
  
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('API Request URL:', url); // デバッグ用
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Request failed:', error);
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
  
  // 認証関連の状態
  const [user, setUser] = useState<User | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState(0); // 0: ログイン, 1: 登録
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
  });

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
        image_url: item.deliverables.startsWith('http') ? item.deliverables : null,
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
      showMessage('コンテンツの作成に失敗しました', 'error');
    } finally {
      setCreating(false);
    }
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
          const userData = { id: Date.now(), email: authData.email, name: authData.email.split('@')[0] };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', response.token);
          setShowAuthDialog(false);
          showMessage('ログインしました！');
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
              const userData = verifyResponse.user;
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
              localStorage.setItem('token', verifyResponse.token);
              setShowAuthDialog(false);
              showMessage('アカウントが作成されました！');
            } catch (error) {
              console.error('Auto verification failed:', error);
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

          {/* 認証ボタン */}
          {user ? (
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
              <Typography variant="h5" fontWeight="bold" color="white" mb={3}>
                新しいコンテンツを作成
              </Typography>

                {/* タイプ選択 */}
                <Typography variant="h6" color="white" mb={2}>
                  生成タイプを選択
                </Typography>
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
                    onClick={handleCreateContent}
                    disabled={creating || !prompt.trim() || !title.trim()}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                      },
                    }}
                  >
                    {creating ? '作成中...' : '作成'}
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
        />
      </Box>
    </ThemeProvider>
  );
};

export default Home;