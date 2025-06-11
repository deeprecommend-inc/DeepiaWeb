import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Chip, IconButton, Menu, MenuItem, Avatar, Button } from '@mui/material';
import { MoreVert, Favorite, Share, Comment, Download } from '@mui/icons-material';
import styled from 'styled-components';

const GlassContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 1200px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
`;

// PiAPI統合用のコンテンツタイプ
const CONTENT_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video', 
  MUSIC: 'music',
  FACESWAP: 'faceswap'
};

// サンプルクリエイター向けコンテンツ
const sampleContents = [
  { 
    id: 1,
    title: 'サイバーパンク都市', 
    thumbnail: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Cyberpunk+City',
    type: CONTENT_TYPES.IMAGE,
    prompt: 'futuristic cyberpunk city with neon lights',
    creator: { name: 'AI Creator', avatar: 'https://via.placeholder.com/40' },
    likes: 127,
    isFollowing: false
  },
  { 
    id: 2,
    title: 'ドリームシネマ', 
    thumbnail: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Dream+Cinema',
    type: CONTENT_TYPES.VIDEO,
    prompt: 'dreamy cinematic landscape with floating islands',
    creator: { name: 'Visual Artist', avatar: 'https://via.placeholder.com/40' },
    likes: 89,
    isFollowing: true
  },
  { 
    id: 3,
    title: 'エピック BGM', 
    thumbnail: 'https://via.placeholder.com/300x200/f093fb/ffffff?text=Epic+Music',
    type: CONTENT_TYPES.MUSIC,
    prompt: 'epic orchestral music for adventure game',
    creator: { name: 'Music AI', avatar: 'https://via.placeholder.com/40' },
    likes: 203,
    isFollowing: false
  },
];

const ContentList = () => {
  const [contents, setContents] = useState(sampleContents);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  const handleMenuClick = (event, content) => {
    setAnchorEl(event.currentTarget);
    setSelectedContent(content);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContent(null);
  };

  const handleFollow = (contentId) => {
    setContents(contents.map(content => 
      content.id === contentId 
        ? { ...content, creator: { ...content.creator, isFollowing: !content.creator.isFollowing } }
        : content
    ));
  };

  const handleLike = (contentId) => {
    setContents(contents.map(content => 
      content.id === contentId 
        ? { ...content, likes: content.likes + 1 }
        : content
    ));
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case CONTENT_TYPES.IMAGE: return '🖼️';
      case CONTENT_TYPES.VIDEO: return '🎬';
      case CONTENT_TYPES.MUSIC: return '🎵';
      case CONTENT_TYPES.FACESWAP: return '🔄';
      default: return '✨';
    }
  };

  return (
    <Box sx={{ position: 'relative', zIndex: 1, py: 4 }}>
      {/* クリエイター向けヘッダー */}
      <GlassContainer>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
              🧠
            </Avatar>
            <div>
              <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
                脳みその拡張 - AI Creative Studio
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                あらゆるコンテンツを生み出すクリエイティブプラットフォーム
              </Typography>
            </div>
          </Box>
          <Button 
            variant="contained" 
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
              }
            }}
          >
            新規作成
          </Button>
        </Box>
      </GlassContainer>

      {/* コンテンツグリッド */}
      <GlassContainer>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
          最新のコンテンツ
        </Typography>
        
        <Grid container spacing={3}>
          {contents.map((content) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={content.id}>
              <Card sx={{ 
                borderRadius: 2, 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  background: 'rgba(255, 255, 255, 0.15)'
                }
              }}>
                <Box position="relative">
                  <CardMedia
                    component="img"
                    height="200"
                    image={content.thumbnail}
                    alt={content.title}
                  />
                  <Chip 
                    label={`${getTypeIcon(content.type)} ${content.type.toUpperCase()}`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white'
                    }}
                  />
                  <IconButton
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                    }}
                    onClick={(e) => handleMenuClick(e, content)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                    {content.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                    "{content.prompt}"
                  </Typography>
                  
                  {/* クリエイター情報 */}
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                      <Avatar src={content.creator.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {content.creator.name}
                      </Typography>
                    </Box>
                    <Button 
                      size="small" 
                      variant={content.isFollowing ? "contained" : "outlined"}
                      onClick={() => handleFollow(content.id)}
                      sx={{ 
                        borderRadius: 2,
                        color: content.isFollowing ? 'white' : 'rgba(255, 255, 255, 0.9)',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: content.isFollowing ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      {content.isFollowing ? 'フォロー中' : 'フォロー'}
                    </Button>
                  </Box>

                  {/* アクションボタン */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" gap={1}>
                      <IconButton size="small" onClick={() => handleLike(content.id)} sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        <Favorite fontSize="small" />
                        <Typography variant="caption" ml={0.5}>{content.likes}</Typography>
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        <Comment fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        <Share fontSize="small" />
                      </IconButton>
                    </Box>
                    <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      <Download fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </GlassContainer>

      {/* メニュー */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>詳細を表示</MenuItem>
        <MenuItem onClick={handleMenuClose}>共有</MenuItem>
        <MenuItem onClick={handleMenuClose}>ダウンロード</MenuItem>
        <MenuItem onClick={handleMenuClose}>報告</MenuItem>
      </Menu>
    </Box>
  );
};

export default ContentList;
