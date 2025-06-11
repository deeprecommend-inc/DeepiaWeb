import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  ReactFlowProvider,
  Controls,
  Background,
  MiniMap,
  Panel,
  ConnectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  FileOpen as TemplateIcon
} from '@mui/icons-material';
import { CustomNode } from './CustomNode';
import { nodeTemplates, nodeCategories } from '../../constants/nodeTemplates';
import { workflowTemplates } from '../../constants/workflowTemplates';
import { NodeTemplate, WorkflowNode, WorkflowEdge, NodeData } from '../../types/workflow';
import { WorkflowExecutionService } from '../../services/workflowExecutionService';

const nodeTypes = {
  custom: CustomNode,
};

interface WorkflowEditorProps {
  open: boolean;
  onClose: () => void;
  apiClient?: any;
}

export const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ open, onClose, apiClient }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedNodeForConfig, setSelectedNodeForConfig] = useState<string | null>(null);
  const [nodeConfigs, setNodeConfigs] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingNodes, setExecutingNodes] = useState<Set<string>>(new Set());

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback((template: NodeTemplate) => {
    const newNodeId = `${template.type}_${Date.now()}`;
    const position = {
      x: Math.random() * 300,
      y: Math.random() * 300,
    };

    const newNode: Node = {
      id: newNodeId,
      type: 'custom',
      position,
      data: {
        id: newNodeId,
        type: template.type,
        label: template.name,
        description: template.description,
        config: { ...template.defaultConfig },
        inputs: template.inputs.map(input => ({ ...input, value: undefined })),
        outputs: template.outputs.map(output => ({ ...output, value: undefined })),
        onDelete: deleteNode,
        onConfigure: configureNode,
        onExecute: executeNode,
        isExecuting: false,
        hasError: false
      } as NodeData & {
        onDelete: (id: string) => void;
        onConfigure: (id: string) => void;
        onExecute: (id: string) => void;
        isExecuting: boolean;
        hasError: boolean;
      }
    };

    setNodes((nds) => [...nds, newNode]);
    setShowNodeSelector(false);
  }, [setNodes, deleteNode, configureNode, executeNode]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    delete nodeConfigs[nodeId];
    setNodeConfigs({ ...nodeConfigs });
  }, [setNodes, setEdges, nodeConfigs]);

  const configureNode = useCallback((nodeId: string) => {
    setSelectedNodeForConfig(nodeId);
  }, []);

  const executeNode = useCallback(async (nodeId: string) => {
    setExecutingNodes(prev => new Set([...prev, nodeId]));
    
    // Update node to show executing state
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, isExecuting: true } }
          : node
      )
    );

    // Simulate execution (replace with actual API calls)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update node to show completed state
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, isExecuting: false, hasError: false } }
            : node
        )
      );
    } catch (error) {
      // Update node to show error state
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, isExecuting: false, hasError: true } }
            : node
        )
      );
    } finally {
      setExecutingNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(nodeId);
        return newSet;
      });
    }
  }, [setNodes]);

  const executeWorkflow = useCallback(async () => {
    if (!apiClient) {
      console.error('API client not available');
      return;
    }

    setIsExecuting(true);
    
    try {
      const executionService = new WorkflowExecutionService(apiClient);
      
      await executionService.executeWorkflow(
        nodes as WorkflowNode[],
        edges as WorkflowEdge[],
        (nodeId) => {
          // ノード実行開始
          setNodes((nds) =>
            nds.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, isExecuting: true, hasError: false } }
                : node
            )
          );
        },
        (nodeId, result) => {
          // ノード実行完了
          setNodes((nds) =>
            nds.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, isExecuting: false, hasError: false } }
                : node
            )
          );
          console.log(`Node ${nodeId} completed:`, result);
        },
        (nodeId, error) => {
          // ノード実行エラー
          setNodes((nds) =>
            nds.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, isExecuting: false, hasError: true } }
                : node
            )
          );
          console.error(`Node ${nodeId} failed:`, error);
        }
      );
      
      console.log('Workflow execution completed');
      
    } catch (error) {
      console.error('Workflow execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  }, [nodes, edges, apiClient, setNodes]);

  const saveWorkflow = useCallback(() => {
    const workflow = {
      id: `workflow_${Date.now()}`,
      name: `ワークフロー ${new Date().toLocaleString()}`,
      nodes: nodes as WorkflowNode[],
      edges: edges as WorkflowEdge[],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to localStorage for now
    const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    savedWorkflows.push(workflow);
    localStorage.setItem('workflows', JSON.stringify(savedWorkflows));
    
    console.log('Workflow saved:', workflow);
  }, [nodes, edges]);

  const loadTemplate = useCallback((templateId: string) => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Convert template nodes to React Flow nodes
    const templateNodes = template.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onDelete: deleteNode,
        onConfigure: configureNode,
        onExecute: executeNode,
        isExecuting: false,
        hasError: false
      }
    }));

    setNodes(templateNodes);
    setEdges(template.edges);
    setShowTemplateSelector(false);
    
    console.log('Template loaded:', template.name);
  }, [deleteNode, configureNode, executeNode, setNodes, setEdges]);

  const selectedNode = useMemo(() => {
    return selectedNodeForConfig ? nodes.find(node => node.id === selectedNodeForConfig) : null;
  }, [selectedNodeForConfig, nodes]);

  const updateNodeConfig = useCallback((nodeId: string, config: any) => {
    setNodeConfigs(prev => ({ ...prev, [nodeId]: config }));
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config } }
          : node
      )
    );
  }, [setNodes]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: '95vw',
          height: '90vh',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          🤖 Agentic Workflow Editor
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<TemplateIcon />}
            onClick={() => setShowTemplateSelector(true)}
            sx={{ backgroundColor: '#9c27b0' }}
          >
            テンプレート
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowNodeSelector(true)}
            sx={{ backgroundColor: '#667eea' }}
          >
            ノード追加
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={executeWorkflow}
            disabled={isExecuting || nodes.length === 0}
            sx={{ backgroundColor: '#4caf50' }}
          >
            実行
          </Button>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={saveWorkflow}
            sx={{ borderColor: 'white', color: 'white' }}
          >
            保存
          </Button>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ height: '100%', p: 0 }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            style={{
              backgroundColor: '#0a0a0a',
            }}
          >
            <Background color="#333" gap={20} />
            <Controls />
            <MiniMap
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid #333'
              }}
              nodeColor="#667eea"
              maskColor="rgba(0, 0, 0, 0.5)"
            />
            
            <Panel position="top-left">
              <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', p: 2, borderRadius: 2 }}>
                <Typography variant="h6" color="white" mb={1}>
                  ワークフロー統計
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                  ノード: {nodes.length} | エッジ: {edges.length}
                </Typography>
                {isExecuting && (
                  <Chip
                    label="実行中..."
                    size="small"
                    sx={{ mt: 1, backgroundColor: '#ff9800', color: 'white' }}
                  />
                )}
              </Box>
            </Panel>
          </ReactFlow>
        </ReactFlowProvider>
      </DialogContent>

      {/* Node Selector Dialog */}
      <Dialog
        open={showNodeSelector}
        onClose={() => setShowNodeSelector(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            color: 'white'
          }
        }}
      >
        <DialogTitle>ノードを選択</DialogTitle>
        <DialogContent>
          {nodeCategories.map((category) => (
            <Accordion key={category.id} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                <Typography color="white">
                  {category.icon} {category.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {nodeTemplates
                    .filter((template) => template.category === category.id)
                    .map((template) => (
                      <ListItem
                        key={template.id}
                        button
                        onClick={() => addNode(template)}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        <ListItemIcon>
                          <Typography variant="h6">{template.icon}</Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={template.name}
                          secondary={template.description}
                          sx={{
                            '& .MuiListItemText-primary': { color: 'white' },
                            '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.7)' },
                          }}
                        />
                        <Chip
                          label={template.type}
                          size="small"
                          sx={{
                            backgroundColor: template.color,
                            color: 'white',
                          }}
                        />
                      </ListItem>
                    ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContent>
      </Dialog>

      {/* Template Selector Dialog */}
      <Dialog
        open={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            color: 'white'
          }
        }}
      >
        <DialogTitle>ワークフローテンプレートを選択</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" mb={3}>
            事前に設定されたワークフローテンプレートから選択して、すぐに使い始めることができます。
          </Typography>
          <List>
            {workflowTemplates.map((template) => (
              <ListItem
                key={template.id}
                button
                onClick={() => loadTemplate(template.id)}
                sx={{
                  borderRadius: 2,
                  mb: 2,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon>
                  <Typography variant="h5">
                    {template.id.includes('content') ? '🎨' : 
                     template.id.includes('code') ? '💻' : 
                     template.id.includes('3d') ? '🧊' : '⚙️'}
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary={template.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" mb={1}>
                        {template.description}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Chip
                          label={`${template.nodes.length} ノード`}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(102, 126, 234, 0.3)',
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                        <Chip
                          label={`${template.edges.length} 接続`}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(156, 39, 176, 0.3)',
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                    </Box>
                  }
                  sx={{
                    '& .MuiListItemText-primary': { 
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Node Configuration Drawer */}
      <Drawer
        anchor="right"
        open={!!selectedNodeForConfig}
        onClose={() => setSelectedNodeForConfig(null)}
        PaperProps={{
          sx: {
            width: 400,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            color: 'white'
          }
        }}
      >
        {selectedNode && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              {selectedNode.data.label} 設定
            </Typography>

            <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

            {/* Basic node info */}
            <Box mb={3}>
              <TextField
                fullWidth
                label="ノード名"
                value={selectedNode.data.label}
                onChange={(e) => {
                  setNodes((nds) =>
                    nds.map((node) =>
                      node.id === selectedNode.id
                        ? { ...node, data: { ...node.data, label: e.target.value } }
                        : node
                    )
                  );
                }}
                sx={{ mb: 2 }}
                InputProps={{
                  style: { color: 'white' }
                }}
                InputLabelProps={{
                  style: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </Box>

            {/* Configuration fields based on node type */}
            {selectedNode.data.type === 'text_generation' && (
              <Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>モデル</InputLabel>
                  <Select
                    value={selectedNode.data.config?.textModel || 'gpt-4'}
                    onChange={(e) =>
                      updateNodeConfig(selectedNode.id, {
                        ...selectedNode.data.config,
                        textModel: e.target.value
                      })
                    }
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="gpt-4">GPT-4</MenuItem>
                    <MenuItem value="gpt-3.5">GPT-3.5</MenuItem>
                    <MenuItem value="claude">Claude</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Temperature"
                  type="number"
                  value={selectedNode.data.config?.temperature || 0.7}
                  onChange={(e) =>
                    updateNodeConfig(selectedNode.id, {
                      ...selectedNode.data.config,
                      temperature: parseFloat(e.target.value)
                    })
                  }
                  inputProps={{ min: 0, max: 1, step: 0.1 }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="最大トークン数"
                  type="number"
                  value={selectedNode.data.config?.maxTokens || 1000}
                  onChange={(e) =>
                    updateNodeConfig(selectedNode.id, {
                      ...selectedNode.data.config,
                      maxTokens: parseInt(e.target.value)
                    })
                  }
                  sx={{ mb: 2 }}
                />
              </Box>
            )}

            {selectedNode.data.type === 'image_generation' && (
              <Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>モデル</InputLabel>
                  <Select
                    value={selectedNode.data.config?.imageModel || 'midjourney'}
                    onChange={(e) =>
                      updateNodeConfig(selectedNode.id, {
                        ...selectedNode.data.config,
                        imageModel: e.target.value
                      })
                    }
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="midjourney">Midjourney</MenuItem>
                    <MenuItem value="dall-e">DALL-E</MenuItem>
                    <MenuItem value="stable-diffusion">Stable Diffusion</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="幅"
                  type="number"
                  value={selectedNode.data.config?.width || 1024}
                  onChange={(e) =>
                    updateNodeConfig(selectedNode.id, {
                      ...selectedNode.data.config,
                      width: parseInt(e.target.value)
                    })
                  }
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="高さ"
                  type="number"
                  value={selectedNode.data.config?.height || 1024}
                  onChange={(e) =>
                    updateNodeConfig(selectedNode.id, {
                      ...selectedNode.data.config,
                      height: parseInt(e.target.value)
                    })
                  }
                  sx={{ mb: 2 }}
                />
              </Box>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={() => setSelectedNodeForConfig(null)}
              sx={{ mt: 3, backgroundColor: '#667eea' }}
            >
              設定完了
            </Button>
          </Box>
        )}
      </Drawer>
    </Dialog>
  );
};