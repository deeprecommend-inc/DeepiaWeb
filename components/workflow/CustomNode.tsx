import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { NodeData } from '../../types/workflow';

interface CustomNodeProps extends NodeProps {
  data: NodeData & {
    onDelete?: (id: string) => void;
    onConfigure?: (id: string) => void;
    onExecute?: (id: string) => void;
    isExecuting?: boolean;
    hasError?: boolean;
  };
}

const getNodeColor = (type: string) => {
  const colors: Record<string, string> = {
    input: '#4CAF50',
    output: '#F44336',
    text_generation: '#2196F3',
    code_generation: '#FF9800',
    image_generation: '#E91E63',
    video_generation: '#9C27B0',
    audio_generation: '#00BCD4',
    model_3d_generation: '#795548',
    model_3d_swap: '#607D8B',
    data_transformer: '#9E9E9E',
    conditional: '#FF5722'
  };
  return colors[type] || '#9E9E9E';
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    input: '📥',
    output: '📤',
    text_generation: '📝',
    code_generation: '💻',
    image_generation: '🎨',
    video_generation: '🎬',
    audio_generation: '🎵',
    model_3d_generation: '🧊',
    model_3d_swap: '🔄',
    data_transformer: '🔧',
    conditional: '🔀'
  };
  return icons[type] || '⚙️';
};

export const CustomNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  const nodeColor = getNodeColor(data.type);
  const typeIcon = getTypeIcon(data.type);

  return (
    <Card
      sx={{
        minWidth: 250,
        backgroundColor: data.hasError ? 'rgba(244, 67, 54, 0.1)' : 'rgba(0, 0, 0, 0.9)',
        border: `2px solid ${selected ? nodeColor : 'rgba(255, 255, 255, 0.2)'}`,
        borderRadius: '12px',
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
          borderColor: nodeColor,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
        },
        opacity: data.isExecuting ? 0.7 : 1,
        transform: data.isExecuting ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      {/* Input Handles */}
      {data.inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{
            top: `${((index + 1) * 100) / (data.inputs.length + 1)}%`,
            backgroundColor: input.required ? '#f44336' : '#2196f3',
            width: 12,
            height: 12,
            border: '2px solid white'
          }}
        />
      ))}

      {/* Output Handles */}
      {data.outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{
            top: `${((index + 1) * 100) / (data.outputs.length + 1)}%`,
            backgroundColor: nodeColor,
            width: 12,
            height: 12,
            border: '2px solid white'
          }}
        />
      ))}

      <CardContent sx={{ p: 2 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" component="span">
              {typeIcon}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold" color="white">
              {data.label}
            </Typography>
          </Box>
          
          <Box display="flex" gap={0.5}>
            {data.onExecute && (
              <Tooltip title="実行">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    data.onExecute?.(data.id);
                  }}
                  sx={{ color: 'white', '&:hover': { color: nodeColor } }}
                >
                  <PlayIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {data.onConfigure && (
              <Tooltip title="設定">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    data.onConfigure?.(data.id);
                  }}
                  sx={{ color: 'white', '&:hover': { color: nodeColor } }}
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {data.onDelete && (
              <Tooltip title="削除">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    data.onDelete?.(data.id);
                  }}
                  sx={{ color: 'white', '&:hover': { color: '#f44336' } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Description */}
        {data.description && (
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" mb={1}>
            {data.description}
          </Typography>
        )}

        {/* Type Chip */}
        <Chip
          label={data.type.replace('_', ' ')}
          size="small"
          sx={{
            backgroundColor: nodeColor,
            color: 'white',
            fontSize: '0.75rem',
            height: 24
          }}
        />

        {/* Status Indicators */}
        {data.isExecuting && (
          <Box mt={1}>
            <Chip
              label="実行中..."
              size="small"
              sx={{
                backgroundColor: '#ff9800',
                color: 'white',
                fontSize: '0.75rem',
                height: 20
              }}
            />
          </Box>
        )}

        {data.hasError && (
          <Box mt={1}>
            <Chip
              label="エラー"
              size="small"
              sx={{
                backgroundColor: '#f44336',
                color: 'white',
                fontSize: '0.75rem',
                height: 20
              }}
            />
          </Box>
        )}

        {/* Input/Output Labels */}
        <Box mt={2}>
          {data.inputs.length > 0 && (
            <Box mb={1}>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                入力:
              </Typography>
              {data.inputs.map((input) => (
                <Typography key={input.id} variant="caption" display="block" color="rgba(255, 255, 255, 0.8)">
                  • {input.name} {input.required && '*'}
                </Typography>
              ))}
            </Box>
          )}
          
          {data.outputs.length > 0 && (
            <Box>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                出力:
              </Typography>
              {data.outputs.map((output) => (
                <Typography key={output.id} variant="caption" display="block" color="rgba(255, 255, 255, 0.8)">
                  • {output.name}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};