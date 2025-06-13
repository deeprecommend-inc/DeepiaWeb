import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  PlayArrow as RunIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Code as CodeIcon,
  Visibility as PreviewIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Fullscreen as FullscreenIcon,
  Save as SaveIcon
} from '@mui/icons-material';
// Simple code editor using textarea (fallback for when react-ace is not available)

interface CodeFile {
  name: string;
  content: string;
  language: string;
}

interface CodeBrowserProps {
  initialFiles?: CodeFile[];
  title?: string;
  onSave?: (files: CodeFile[]) => void;
  onShare?: (files: CodeFile[]) => void;
  user?: any;
  onAuthRequired?: () => void;
}

export const CodeBrowser: React.FC<CodeBrowserProps> = ({
  initialFiles = [
    { name: 'index.html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Generated App</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>', language: 'html' },
    { name: 'style.css', content: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}', language: 'css' },
    { name: 'script.js', content: 'console.log("Hello from generated code!");', language: 'javascript' }
  ],
  title = "Code Browser",
  onSave,
  onShare,
  user,
  onAuthRequired
}) => {
  const [files, setFiles] = useState<CodeFile[]>(initialFiles);
  const [activeTab, setActiveTab] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('code');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('Generated Project');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentFile = files[activeTab];

  const updateFileContent = (content: string) => {
    const updatedFiles = [...files];
    updatedFiles[activeTab] = { ...currentFile, content };
    setFiles(updatedFiles);
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput('Running code...');

    try {
      // HTML ファイルの内容を iframe で実行
      const htmlFile = files.find(f => f.language === 'html');
      const cssFile = files.find(f => f.language === 'css');
      const jsFile = files.find(f => f.language === 'javascript');

      if (htmlFile && iframeRef.current) {
        let htmlContent = htmlFile.content;

        // CSS を組み込み
        if (cssFile) {
          htmlContent = htmlContent.replace(
            '</head>',
            `<style>${cssFile.content}</style>\n</head>`
          );
        }

        // JavaScript を組み込み
        if (jsFile) {
          htmlContent = htmlContent.replace(
            '</body>',
            `<script>${jsFile.content}</script>\n</body>`
          );
        }

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        iframeRef.current.src = url;

        setOutput('Code executed successfully!');
      } else {
        setOutput('No HTML file found to execute.');
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const downloadProject = () => {
    // プロジェクトをZIPファイルとしてダウンロード（簡易版）
    files.forEach((file) => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleSave = () => {
    if (!user) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }
    if (onSave) {
      onSave(files);
    }
    setSaveDialogOpen(false);
  };

  const handleShare = () => {
    if (!user) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }
    if (onShare) {
      onShare(files);
    }
  };

  const getFileExtension = (language: string) => {
    switch (language) {
      case 'html': return '.html';
      case 'css': return '.css';
      case 'javascript': return '.js';
      case 'python': return '.py';
      default: return '.txt';
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <CodeIcon sx={{ mr: 1 }} />
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Run Code">
              <IconButton 
                onClick={runCode} 
                disabled={isRunning}
                color="primary"
                sx={{ bgcolor: 'success.main', color: 'white', '&:hover': { bgcolor: 'success.dark' } }}
              >
                {isRunning ? <StopIcon /> : <RunIcon />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Save Project">
              <IconButton onClick={() => setSaveDialogOpen(true)}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Download">
              <IconButton onClick={downloadProject}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Share">
              <IconButton onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            
            <Button
              variant={previewMode === 'code' ? 'contained' : 'outlined'}
              startIcon={<CodeIcon />}
              onClick={() => setPreviewMode('code')}
              size="small"
            >
              Code
            </Button>
            
            <Button
              variant={previewMode === 'preview' ? 'contained' : 'outlined'}
              startIcon={<PreviewIcon />}
              onClick={() => setPreviewMode('preview')}
              size="small"
            >
              Preview
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Code Editor */}
        <Box sx={{ width: previewMode === 'preview' ? '50%' : '100%', display: 'flex', flexDirection: 'column' }}>
          {/* File Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 'auto' }}
          >
            {files.map((file, index) => (
              <Tab
                key={index}
                label={file.name}
                sx={{ 
                  minHeight: 'auto',
                  py: 1,
                  textTransform: 'none',
                  fontSize: '0.875rem'
                }}
              />
            ))}
          </Tabs>

          {/* Editor */}
          <Box sx={{ flex: 1 }}>
            <TextField
              multiline
              value={currentFile.content}
              onChange={(e) => updateFileContent(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{
                height: '100%',
                '& .MuiOutlinedInput-root': {
                  height: '100%',
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  '& textarea': {
                    height: '100% !important',
                    resize: 'none'
                  }
                }
              }}
              InputProps={{
                style: {
                  height: '100%',
                  alignItems: 'flex-start',
                  padding: '12px'
                }
              }}
              placeholder={`Enter your ${currentFile.language} code here...`}
            />
          </Box>
        </Box>

        {/* Preview Panel */}
        {previewMode === 'preview' && (
          <Box sx={{ width: '50%', borderLeft: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
            <Paper sx={{ p: 1, borderRadius: 0, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                <PreviewIcon sx={{ mr: 1, fontSize: 'small' }} />
                Live Preview
              </Typography>
            </Paper>
            
            <Box sx={{ flex: 1, position: 'relative' }}>
              {isRunning && (
                <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} />
              )}
              <iframe
                ref={iframeRef}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: 'white'
                }}
                title="Preview"
              />
            </Box>

            {/* Output Console */}
            <Paper sx={{ p: 2, borderRadius: 0, bgcolor: 'grey.900', color: 'white', maxHeight: '150px', overflow: 'auto' }}>
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mb: 1 }}>
                Console Output:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                {output || 'No output'}
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Project</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            sx={{ mt: 1 }}
          />
          
          <Alert severity="info" sx={{ mt: 2 }}>
            This will save your project to the Deepia platform where others can discover and use it.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};