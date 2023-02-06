import { useRouter } from 'next/router';
import { Typography, Box } from '@mui/material';

export const SwitchLang = ({ path }) => {
    const router = useRouter();

    const toEn = () => {
        router.push(path, '/', { locale: 'en' });
    };

    const toJa = () => {
        router.push(path, '/', { locale: 'ja' });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                gap: '12px',
                margin: '8px 0',
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                onClick={toEn}
            >
                English
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                onClick={toJa}
            >
                日本語
            </Typography>
        </Box>
    );
};
