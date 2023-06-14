import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { Box } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { darkMode, lightMode } from '../../general/constants/theme';

const LoadingOverlay = () => {
    const dark = useAppSelector((state) => state.ui.dark);
    const isLoading = useAppSelector((state: RootState) => state.ui.loading);

    if (!isLoading) {
        return null;
    }

    return (
        <ThemeProvider theme={dark ? darkMode : lightMode}>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 9999,
                }}
            >
                <LinearProgress
                    sx={{
                        width: '100%',
                        position: 'absolute',
                        top: '0',
                    }}
                />
            </Box>
        </ThemeProvider>
    );
};

export default LoadingOverlay;
