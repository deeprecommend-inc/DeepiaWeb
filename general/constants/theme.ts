import { pink, deepPurple } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const darkMode = createTheme({
    palette: {
        primary: {
            main: deepPurple[400],
        },
        mode: 'dark',
    },
});

const lightMode = createTheme({
    palette: {
        primary: {
            main: deepPurple[500],
        },
    },
});

export { darkMode, lightMode };
