// components/LoadingOverlay.js
import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { Box } from '@mui/system';

const LoadingOverlay = () => {
    const isLoading = useAppSelector((state: RootState) => state.ui.loading);

    if (!isLoading) {
        return null;
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                bgcolor: 'rgba(255, 255, 255, 0.7)',
            }}
        >
            <LinearProgress
                sx={{
                    width: '100%',
                    position: 'absolute',
                    top: '50%',
                }}
            />
        </Box>
    );
};

export default LoadingOverlay;
