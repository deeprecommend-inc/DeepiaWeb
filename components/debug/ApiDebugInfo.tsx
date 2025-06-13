import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

interface ApiDebugInfoProps {
  open: boolean;
  onClose: () => void;
  error?: any;
  requestData?: any;
  responseData?: any;
}

export const ApiDebugInfo: React.FC<ApiDebugInfoProps> = ({
  open,
  onClose,
  error,
  requestData,
  responseData
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>API Debug Information</DialogTitle>
      
      <DialogContent>
        <Alert severity="error" sx={{ mb: 2 }}>
          API通信エラーが発生しました
        </Alert>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">エラー詳細</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="pre" sx={{ 
              backgroundColor: '#f5f5f5', 
              p: 2, 
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.875rem'
            }}>
              {JSON.stringify(error, null, 2)}
            </Box>
          </AccordionDetails>
        </Accordion>

        {requestData && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">リクエストデータ</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box component="pre" sx={{ 
                backgroundColor: '#f5f5f5', 
                p: 2, 
                borderRadius: 1,
                overflow: 'auto',
                fontSize: '0.875rem'
              }}>
                {JSON.stringify(requestData, null, 2)}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {responseData && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">レスポンスデータ</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box component="pre" sx={{ 
                backgroundColor: '#f5f5f5', 
                p: 2, 
                borderRadius: 1,
                overflow: 'auto',
                fontSize: '0.875rem'
              }}>
                {JSON.stringify(responseData, null, 2)}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        <Box mt={2}>
          <Typography variant="h6" gutterBottom>推奨対処法</Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>DeepiaAPIサーバーが起動しているか確認してください</li>
              <li>API エンドポイント URL が正しいか確認してください</li>
              <li>認証トークンが有効か確認してください</li>
              <li>リクエストデータの形式が正しいか確認してください</li>
              <li>ネットワーク接続を確認してください</li>
            </ol>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
};