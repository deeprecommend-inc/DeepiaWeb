import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel, Button, Chip, Grid, Paper, Typography, Alert, CircularProgress, Snackbar, Card, CardContent } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import FaceIcon from '@mui/icons-material/Face';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import styled from 'styled-components';
import { piApiService, GenerationRequest, GenerationResponse } from '../../services/piapi.service';

// ビデオ背景付きのコンテナ
const VideoBackgroundContainer = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;

const BackgroundVideo = styled.video`
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -1;
  transform: translateX(-50%) translateY(-50%);
  object-fit: cover;
`;

const VideoOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
`;

const GlassContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 800px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
    }
    
    &.Mui-focused {
      background: rgba(255, 255, 255, 0.25);
      border-color: #667eea;
    }
  }
  
  & .MuiOutlinedInput-input {
    color: #fff;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
  }
  
  & .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.8);
    
    &.Mui-focused {
      color: #667eea;
    }
  }
`;

const StyledFormControl = styled(FormControl)`
  & .MuiOutlinedInput-root {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
  }
  
  & .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.8);
  }
  
  & .MuiSelect-select {
    color: #fff;
  }
`;

interface GenerationResult {
  id: string;
  model: string;
  prompt: string;
  result?: {
    url: string;
    thumbnail?: string;
  };
  status: string;
  error?: string;
}

const TextBox = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('image');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [generationResults, setGenerationResults] = useState<GenerationResult[]>([]);

  const showMessage = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showMessage('プロンプトを入力してください', 'error');
      return;
    }

    if (!selectedModel) {
      showMessage('モデルを選択してください', 'error');
      return;
    }

    setLoading(true);

    try {
      const generationId = `gen_${Date.now()}`;
      const newResult: GenerationResult = {
        id: generationId,
        model: selectedModel,
        prompt: prompt,
        status: 'generating'
      };

      setGenerationResults(prev => [newResult, ...prev]);

      const request: GenerationRequest = {
        model: selectedModel,
        prompt: prompt,
        options: {
          size: selectedCategory === 'image' ? '1024x1024' : undefined,
          duration: selectedCategory === 'video' ? 30 : undefined
        }
      };

      const response = await piApiService.generateContent(request);

      if (response.success && response.data) {
        const updatedResult: GenerationResult = {
          ...newResult,
          result: {
            url: response.data.url,
            thumbnail: response.data.thumbnail
          },
          status: 'completed'
        };
        
        setGenerationResults(prev => 
          prev.map(result => result.id === generationId ? updatedResult : result)
        );
        
        showMessage('生成が完了しました！', 'success');
      } else {
        throw new Error(response.error || '生成に失敗しました');
      }
    } catch (error) {
      console.error('Generation error:', error);
      
      setGenerationResults(prev => 
        prev.map(result => 
          result.id === generationResults[0]?.id 
            ? { ...result, status: 'error', error: error.message }
            : result
        )
      );
      
      showMessage(`エラーが発生しました: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getModelsByType = (type: string) => {
    return piApiService.getAvailableModels().filter(model => model.type === type);
  };

  const resetGeneration = () => {
    setPrompt('');
    setSelectedModel('');
    setGenerationResults([]);
  };

  const modelCategories = [
    { value: 'image', label: 'イメージ生成', icon: <ImageIcon /> },
    { value: 'video', label: 'ビデオ生成', icon: <VideoCallIcon /> },
    { value: 'music', label: 'ミュージック生成', icon: <AudiotrackIcon /> },
    { value: 'faceswap', label: 'フェイススワップ', icon: <FaceIcon /> },
  ];

  return (
    <VideoBackgroundContainer>
      {/* 背景ビデオ */}
      <BackgroundVideo autoPlay muted loop>
        <source src="/deepia2.mp4" type="video/mp4" />
      </BackgroundVideo>
      <VideoOverlay />

      {/* メインコンテンツ */}
      <Box sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        <GlassContainer>
          {/* ヘッダー */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
              🧠 Deepia2 - AI Creative Studio
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              あらゆるコンテンツを生み出すAIクリエイティブプラットフォーム
            </Typography>
          </Box>

          {/* カテゴリー選択 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              生成タイプを選択
            </Typography>
            <Grid container spacing={2}>
              {modelCategories.map((category) => (
                <Grid item xs={6} sm={3} key={category.value}>
                  <Chip
                    icon={category.icon}
                    label={category.label}
                    clickable
                    color={selectedCategory === category.value ? 'primary' : 'default'}
                    variant={selectedCategory === category.value ? 'filled' : 'outlined'}
                    onClick={() => {
                      setSelectedCategory(category.value);
                      setSelectedModel('');
                    }}
                    sx={{ 
                      width: '100%', 
                      height: 48,
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* モデル選択 */}
          <StyledFormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>モデルを選択</InputLabel>
            <Select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              label="モデルを選択"
            >
              {getModelsByType(selectedCategory).map((model) => (
                <MenuItem key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>

          {/* プロンプト入力 */}
          <StyledTextField
            fullWidth
            multiline
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="生成したいコンテンツの説明を入力してください..."
            variant="outlined"
            sx={{ mb: 3 }}
          />

          {/* 操作ボタン */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || !selectedModel}
              sx={{ 
                minWidth: 120,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                }
              }}
            >
              {loading ? '生成中...' : '生成開始'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={resetGeneration}
              disabled={loading}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              リセット
            </Button>
          </Box>
        </GlassContainer>

        {/* 生成結果表示 */}
        {generationResults.length > 0 && (
          <GlassContainer>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'white', mb: 3 }}>
              生成結果
            </Typography>
            <Grid container spacing={3}>
              {generationResults.map((result) => (
                <Grid item xs={12} sm={6} md={4} key={result.id}>
                  <Card sx={{ 
                    borderRadius: 2, 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                        {result.model}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                        "{result.prompt}"
                      </Typography>
                      
                      {result.status === 'generating' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={20} sx={{ color: 'white' }} />
                          <Typography variant="body2" sx={{ color: 'white' }}>生成中...</Typography>
                        </Box>
                      )}
                      
                      {result.status === 'completed' && result.result && (
                        <Box>
                          <img 
                            src={result.result.thumbnail || result.result.url} 
                            alt="Generated content"
                            style={{ width: '100%', borderRadius: '8px' }}
                          />
                          <Button
                            fullWidth
                            variant="outlined"
                            sx={{ 
                              mt: 2,
                              color: 'white',
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                              '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                              }
                            }}
                            href={result.result.url}
                            target="_blank"
                          >
                            フルサイズで表示
                          </Button>
                        </Box>
                      )}
                      
                      {result.status === 'error' && (
                        <Alert severity="error">
                          {result.error || '生成に失敗しました'}
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </GlassContainer>
        )}

        {/* スナックバー */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </VideoBackgroundContainer>
  );
};

const PromptArea = () => {
  return <TextBox />;
};

export default PromptArea;
