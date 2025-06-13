import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Send,
  AttachFile,
  EmojiEmotions,
  PersonAdd,
  PersonRemove,
  Notifications,
  VideoCall,
  Call,
  MoreVert
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Paper)(({ theme }) => ({
  height: '80vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: '16px 24px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const MessagesContainer = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  padding: '16px',
  background: 'rgba(255, 255, 255, 0.8)'
});

const MessageBubble = styled(Box)<{ isOwn?: boolean }>(({ isOwn }) => ({
  maxWidth: '70%',
  margin: '8px 0',
  padding: '12px 16px',
  borderRadius: '18px',
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  background: isOwn 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'rgba(255, 255, 255, 0.9)',
  color: isOwn ? 'white' : 'black',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  marginLeft: isOwn ? 'auto' : '0',
  marginRight: isOwn ? '0' : 'auto'
}));

const InputContainer = styled(Box)({
  padding: '16px 24px',
  background: 'rgba(255, 255, 255, 0.9)',
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-end'
});

interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    isCreator: boolean;
  };
  timestamp: Date;
  isOwn: boolean;
  attachments?: string[];
}

interface Creator {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isFollowing: boolean;
  followers: number;
  specialties: string[];
  bio: string;
  isCreator: boolean;
}

const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'AI Artist Pro',
    avatar: 'https://via.placeholder.com/40',
    isOnline: true,
    isFollowing: true,
    followers: 1250,
    specialties: ['画像生成', '動画編集'],
    bio: 'デジタルアートとAI生成のプロフェッショナル',
    isCreator: true
  },
  {
    id: '2', 
    name: 'Music AI Creator',
    avatar: 'https://via.placeholder.com/40',
    isOnline: false,
    isFollowing: false,
    followers: 890,
    specialties: ['音楽生成', 'サウンドデザイン'],
    bio: 'AI音楽生成の専門家',
    isCreator: true
  },
  {
    id: '3',
    name: 'Video Wizard',
    avatar: 'https://via.placeholder.com/40', 
    isOnline: true,
    isFollowing: true,
    followers: 2100,
    specialties: ['動画生成', 'VFX'],
    bio: 'ビデオコンテンツとVFXのクリエイター',
    isCreator: true
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'こんにちは！新しいAI画像生成プロジェクトについて相談があります',
    sender: mockCreators[0],
    timestamp: new Date(),
    isOwn: false
  },
  {
    id: '2', 
    text: 'もちろんです！どのようなスタイルの画像を生成したいですか？',
    sender: mockCreators[1],
    timestamp: new Date(),
    isOwn: true
  },
  {
    id: '3',
    text: 'サイバーパンク風の都市景観を作りたいのですが、Midjourneyがいいでしょうか？',
    sender: mockCreators[0],
    timestamp: new Date(), 
    isOwn: false
  }
];

export const CreatorChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(mockCreators[0]);
  const [creators, setCreators] = useState<Creator[]>(mockCreators);
  const [showCreatorProfile, setShowCreatorProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedCreator) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: {
        id: 'current-user',
        name: 'あなた',
        avatar: 'https://via.placeholder.com/40',
        isCreator: true
      },
      timestamp: new Date(),
      isOwn: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleFollow = (creatorId: string) => {
    setCreators(creators.map(creator => 
      creator.id === creatorId 
        ? { 
            ...creator, 
            isFollowing: !creator.isFollowing,
            followers: creator.isFollowing ? creator.followers - 1 : creator.followers + 1
          }
        : creator
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box display="flex" gap={2} height="80vh">
      {/* クリエイター一覧 */}
      <Paper sx={{ width: 300, borderRadius: '20px', overflow: 'hidden' }}>
        <Box p={2} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">
            🧠 クリエイター
          </Typography>
        </Box>
        <List sx={{ maxHeight: 'calc(80vh - 80px)', overflowY: 'auto' }}>
          {creators.map((creator) => (
            <ListItem 
              key={creator.id}
              button
              selected={selectedCreator?.id === creator.id}
              onClick={() => setSelectedCreator(creator)}
              sx={{ 
                '&.Mui-selected': { 
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' 
                }
              }}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: creator.isOnline ? '#44b700' : '#gray',
                      color: creator.isOnline ? '#44b700' : '#gray'
                    }
                  }}
                >
                  <Avatar src={creator.avatar} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={creator.name}
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">
                      {creator.followers} フォロワー
                    </Typography>
                    <Box display="flex" gap={0.5} mt={0.5}>
                      {creator.specialties.slice(0, 2).map(specialty => (
                        <Chip 
                          key={specialty} 
                          label={specialty} 
                          size="small" 
                          sx={{ fontSize: '0.6rem', height: '16px' }}
                        />
                      ))}
                    </Box>
                  </Box>
                }
              />
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollow(creator.id);
                }}
                color={creator.isFollowing ? "primary" : "default"}
              >
                {creator.isFollowing ? <PersonRemove /> : <PersonAdd />}
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* チャットエリア */}
      <ChatContainer elevation={3} sx={{ flexGrow: 1 }}>
        {selectedCreator && (
          <>
            <ChatHeader>
              <Box display="flex" alignItems="center" gap={2}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: selectedCreator.isOnline ? '#44b700' : '#gray'
                    }
                  }}
                >
                  <Avatar src={selectedCreator.avatar} />
                </Badge>
                <Box>
                  <Typography variant="h6">{selectedCreator.name}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {selectedCreator.isOnline ? 'オンライン' : '最終ログイン: 2時間前'}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={1}>
                <IconButton sx={{ color: 'white' }}>
                  <Call />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <VideoCall />
                </IconButton>
                <IconButton 
                  sx={{ color: 'white' }}
                  onClick={() => setShowCreatorProfile(true)}
                >
                  <MoreVert />
                </IconButton>
              </Box>
            </ChatHeader>

            <MessagesContainer>
              {messages.map((message) => (
                <Box key={message.id} display="flex" flexDirection="column">
                  <Box display="flex" alignItems="flex-end" gap={1} mb={1}>
                    {!message.isOwn && (
                      <Avatar src={message.sender.avatar} sx={{ width: 24, height: 24 }} />
                    )}
                    <MessageBubble isOwn={message.isOwn}>
                      <Typography variant="body2">{message.text}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem', marginTop: '4px', display: 'block' }}>
                        {message.timestamp.toLocaleTimeString()}
                      </Typography>
                    </MessageBubble>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputContainer>
              <IconButton>
                <AttachFile />
              </IconButton>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="メッセージを入力..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    backgroundColor: 'white'
                  }
                }}
              />
              <IconButton>
                <EmojiEmotions />
              </IconButton>
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                <Send />
              </Button>
            </InputContainer>
          </>
        )}
      </ChatContainer>

      {/* クリエイタープロフィールダイアログ */}
      <Dialog 
        open={showCreatorProfile} 
        onClose={() => setShowCreatorProfile(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          クリエイタープロフィール
        </DialogTitle>
        <DialogContent>
          {selectedCreator && (
            <Card sx={{ borderRadius: '15px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar src={selectedCreator.avatar} sx={{ width: 80, height: 80 }} />
                  <Box>
                    <Typography variant="h6">{selectedCreator.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedCreator.followers} フォロワー
                    </Typography>
                    <Button
                      variant={selectedCreator.isFollowing ? "outlined" : "contained"}
                      size="small"
                      onClick={() => handleFollow(selectedCreator.id)}
                      sx={{ mt: 1, borderRadius: '15px' }}
                    >
                      {selectedCreator.isFollowing ? 'フォロー解除' : 'フォローする'}
                    </Button>
                  </Box>
                </Box>
                
                <Typography variant="body2" paragraph>
                  {selectedCreator.bio}
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>専門分野</Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {selectedCreator.specialties.map(specialty => (
                      <Chip key={specialty} label={specialty} size="small" />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}; 