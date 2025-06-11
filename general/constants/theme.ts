import { blue, grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const darkMode = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: blue[400],
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
    },
    shape: {
        borderRadius: 8,
    },
});

const lightMode = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: blue[600],
        },
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
        },
    },
    shape: {
        borderRadius: 8,
    },
});

export { darkMode, lightMode };
