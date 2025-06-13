import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { ContentDto } from '../../libs/content/session/dto/content.dto';

interface ContentEditDialogProps {
  open: boolean;
  content: ContentDto | null;
  onClose: () => void;
  onSave: (contentId: number, updatedData: { prompt: string; deliverables?: string }) => void;
}

export const ContentEditDialog: React.FC<ContentEditDialogProps> = ({
  open,
  content,
  onClose,
  onSave
}) => {
  const [prompt, setPrompt] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (content) {
      setPrompt(content.prompt || '');
      setDeliverables(content.deliverables || '');
      setError('');
    }
  }, [content]);

  const handleSave = async () => {
    if (!content) return;
    
    if (!prompt.trim()) {
      setError('プロンプトを入力してください');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await onSave(content.id, {
        prompt: prompt.trim(),
        deliverables: deliverables.trim()
      });
      onClose();
    } catch (err) {
      setError('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div">
          ✏️ コンテンツを編集
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="プロンプト"
            fullWidth
            multiline
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            label="説明・詳細"
            fullWidth
            multiline
            rows={4}
            value={deliverables}
            onChange={(e) => setDeliverables(e.target.value)}
            helperText="オプション: コンテンツの説明や詳細情報"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || !prompt.trim()}
          sx={{ ml: 1 }}
        >
          {loading ? '保存中...' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};