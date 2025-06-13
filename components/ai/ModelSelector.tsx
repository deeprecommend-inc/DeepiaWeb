import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  ThreeDRotation as Model3DIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { AIModel, ModelParameter, getModelsByCategory } from '../../constants/aiModels';

interface ModelSelectorProps {
  open: boolean;
  onClose: () => void;
  category: 'image' | 'video' | 'audio' | '3d';
  onModelSelect: (model: AIModel, parameters: Record<string, any>, taskType: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  open,
  onClose,
  category,
  onModelSelect
}) => {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [selectedTaskType, setSelectedTaskType] = useState<string>('');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const models = getModelsByCategory(category);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'image': return <ImageIcon />;
      case 'video': return <VideoIcon />;
      case 'audio': return <AudioIcon />;
      case '3d': return <Model3DIcon />;
      default: return <ImageIcon />;
    }
  };

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'image': return '画像生成';
      case 'video': return '動画生成';
      case 'audio': return '音楽生成';
      case '3d': return '3Dモデル生成';
      default: return '生成';
    }
  };

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
    setSelectedTaskType(model.taskTypes[0]?.id || '');
    
    // デフォルトパラメータを設定
    const defaultParams: Record<string, any> = {};
    model.parameters.forEach(param => {
      if (param.default !== undefined) {
        defaultParams[param.id] = param.default;
      } else if (param.required) {
        defaultParams[param.id] = '';
      }
    });
    setParameters(defaultParams);
  };

  const handleParameterChange = (paramId: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

  const renderParameterInput = (param: ModelParameter) => {
    const value = parameters[param.id] ?? param.default ?? '';

    switch (param.type) {
      case 'string':
        return (
          <TextField
            key={param.id}
            fullWidth
            label={param.name}
            value={value}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            multiline={param.id.includes('prompt')}
            rows={param.id.includes('prompt') ? 3 : 1}
            required={param.required}
            helperText={param.description}
            sx={{ mb: 2 }}
          />
        );

      case 'select':
        return (
          <FormControl key={param.id} fullWidth sx={{ mb: 2 }}>
            <InputLabel>{param.name}</InputLabel>
            <Select
              value={value}
              label={param.name}
              onChange={(e) => handleParameterChange(param.id, e.target.value)}
            >
              {param.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
              {param.description}
            </Typography>
          </FormControl>
        );

      case 'number':
        return (
          <Box key={param.id} sx={{ mb: 3 }}>
            <Typography gutterBottom>{param.name}</Typography>
            <Slider
              value={value || param.default || param.min || 0}
              onChange={(_, newValue) => handleParameterChange(param.id, newValue)}
              min={param.min}
              max={param.max}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
            <Typography variant="caption" color="textSecondary">
              {param.description}
            </Typography>
          </Box>
        );

      case 'boolean':
        return (
          <FormControlLabel
            key={param.id}
            control={
              <Switch
                checked={Boolean(value)}
                onChange={(e) => handleParameterChange(param.id, e.target.checked)}
              />
            }
            label={
              <Box>
                <Typography>{param.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {param.description}
                </Typography>
              </Box>
            }
            sx={{ mb: 2, alignItems: 'flex-start' }}
          />
        );

      default:
        return null;
    }
  };

  const handleGenerate = () => {
    if (!selectedModel || !selectedTaskType) return;

    // 必須パラメータのチェック
    const missingParams = selectedModel.parameters
      .filter(param => param.required && !parameters[param.id])
      .map(param => param.name);

    if (missingParams.length > 0) {
      alert(`必須パラメータが不足しています: ${missingParams.join(', ')}`);
      return;
    }

    onModelSelect(selectedModel, parameters, selectedTaskType);
    onClose();
  };

  const requiredParams = selectedModel?.parameters.filter(p => p.required) || [];
  const optionalParams = selectedModel?.parameters.filter(p => !p.required) || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {getCategoryIcon(category)}
          <Typography variant="h6">
            {getCategoryName(category)}モデル選択
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {!selectedModel ? (
          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              使用するAIモデルを選択してください
            </Typography>
            
            <Grid container spacing={2}>
              {models.map((model) => (
                <Grid item xs={12} sm={6} key={model.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: '100%',
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleModelSelect(model)}
                      sx={{ height: '100%', p: 2 }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Typography variant="h6" component="div">
                            {model.name}
                          </Typography>
                          <Chip 
                            label={model.provider} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        </Box>
                        
                        <Typography variant="body2" color="textSecondary" mb={2}>
                          {model.description}
                        </Typography>

                        <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                          {model.taskTypes.map((taskType) => (
                            <Chip
                              key={taskType.id}
                              label={taskType.name}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>

                        {model.pricing && (
                          <Typography variant="caption" color="primary">
                            💰 {model.pricing}
                          </Typography>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">{selectedModel.name}</Typography>
              <Typography variant="body2">{selectedModel.description}</Typography>
            </Alert>

            {/* タスクタイプ選択 */}
            {selectedModel.taskTypes.length > 1 && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>タスクタイプ</InputLabel>
                <Select
                  value={selectedTaskType}
                  label="タスクタイプ"
                  onChange={(e) => setSelectedTaskType(e.target.value)}
                >
                  {selectedModel.taskTypes.map((taskType) => (
                    <MenuItem key={taskType.id} value={taskType.id}>
                      {taskType.name} - {taskType.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* 必須パラメータ */}
            {requiredParams.length > 0 && (
              <Box mb={3}>
                <Typography variant="h6" gutterBottom color="error">
                  必須パラメータ
                </Typography>
                {requiredParams.map(renderParameterInput)}
              </Box>
            )}

            {/* オプションパラメータ */}
            {optionalParams.length > 0 && (
              <Accordion expanded={showAdvanced} onChange={() => setShowAdvanced(!showAdvanced)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <SettingsIcon />
                    <Typography>詳細設定 ({optionalParams.length}個のオプション)</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {optionalParams.map(renderParameterInput)}
                </AccordionDetails>
              </Accordion>
            )}

            {/* 使用例 */}
            {selectedModel.examples && (
              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  使用例
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {selectedModel.examples.map((example, index) => (
                    <Chip
                      key={index}
                      label={example}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const promptParam = requiredParams.find(p => p.id === 'prompt');
                        if (promptParam) {
                          handleParameterChange('prompt', example);
                        }
                      }}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        {selectedModel && (
          <>
            <Button 
              onClick={() => setSelectedModel(null)} 
              color="secondary"
            >
              モデル変更
            </Button>
            <Button 
              onClick={handleGenerate} 
              variant="contained"
              disabled={!selectedTaskType || requiredParams.some(p => !parameters[p.id])}
            >
              生成開始
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};