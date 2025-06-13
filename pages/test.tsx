import React from 'react';
import { Box, Typography } from '@mui/material';

export default function TestPage() {
  return (
    <Box p={4}>
      <Typography variant="h4">Test Page</Typography>
      <Typography>This is a simple test page to verify the system is working.</Typography>
    </Box>
  );
}