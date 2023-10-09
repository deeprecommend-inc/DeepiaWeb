import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../components/organisms/Copyright';
import Logo from '../components/atoms/Logo';
import { Controller, useForm } from 'react-hook-form';
import { AuthLoginDto } from '../libs/auth/session/dto/auth.login.dto';
import { REGEXP } from '../general/utils/regExp';
import { useRouter } from 'next/router';
import {
    Alert,
    IconButton,
    InputAdornment,
    Snackbar,
    SnackbarOrigin,
} from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    setCurrentUser,
    updateIsAfterLogin,
} from '../redux/reducers/authSlice';
import { NextSeo } from 'next-seo';
import { authUiController } from '../libs/auth/presentation/auth.ui.controller';
import { accessTokenKey } from '../general/constants/localStorageKey';
import { asyncLocalStorage } from '../general/utils/asyncLocalStorage';
import { useLocale } from '../hooks/useLocale';
import { SwitchLang } from '../components/atoms/SwitchLang';
import { darkMode, lightMode } from '../general/constants/theme';
import { RootState } from '../redux/store';
import { setDark } from '../redux/reducers/uiSlice';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const snackbarPosition: SnackbarOrigin = {
    vertical: 'top',
    horizontal: 'center',
};

export default function SignIn() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const dark = useAppSelector((state: RootState) => state.ui.dark);
    const { handleSubmit, control, reset, setValue } = useForm();
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const { t, locale } = useLocale();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const init = async () => {
            await dispatch(setDark(false));
        };

        init();
    }, []);

    const handleClose = () => {
        setOpenSuccessSnackbar(false);
        setOpenErrorSnackbar(false);
    };

    const successSnackbar = (reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSuccessSnackbar(true);
    };

    const errorSnackbar = (reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenErrorSnackbar(true);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data: AuthLoginDto) => {
        const dto = await authUiController.login(data);

        if (!dto.token) return errorSnackbar();

        await asyncLocalStorage.setItem(accessTokenKey, dto.token);
        successSnackbar();

        await setInitData(dto.token);
        dispatch(updateIsAfterLogin(true));

        router.push('/');
    };

    const setInitData = async (token: string) => {
        const currentUser = await authUiController.currentUser();

        dispatch(setCurrentUser(currentUser));
    };

    return (
        <>
            <NextSeo
                title={t.login.head.title}
                description={t.login.head.description}
                canonical={'https://deepia.space'}
                openGraph={{
                    url: 'https://deepia.space',
                    title: t.index.head.title,
                    description: t.index.head.description,
                    type: 'website',
                    locale: locale,
                    images: [
                        {
                            url: 'https://deepia.s3.ap-northeast-1.amazonaws.com/DeepRecommend+(1).png',
                            width: 800,
                            height: 600,
                            alt: 'DeepRecommend',
                            type: 'image/png',
                        },
                        {
                            url: 'https://deepia.s3.ap-northeast-1.amazonaws.com/DeepRecommend+(1).png',
                            width: 900,
                            height: 800,
                            alt: 'DeepRecommend',
                            type: 'image/png',
                        },
                        {
                            url: 'https://deepia.s3.ap-northeast-1.amazonaws.com/DeepRecommend+(1).png',
                        },
                    ],
                    site_name: 'DeepRecommend',
                }}
                twitter={{
                    handle: '@DeepRecommend',
                    site: '@DeepRecommend',
                    cardType: 'summary',
                }}
            />
            <ThemeProvider theme={dark ? darkMode : lightMode}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box sx={{ m: 1 }}>
                            <Logo />
                        </Box>
                        <Typography component="h1" variant="h5">
                            Deepia
                        </Typography>
                        <Typography>{t.signup.header.description}</Typography>
                        <Box
                            sx={{
                                mt: 1,
                                textAlign: 'center',
                                marginTop: '24px',
                            }}
                        >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* @ts-ignore */}
                                <Controller
                                    name={'email'}
                                    control={control}
                                    defaultValue=""
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <TextField
                                            label={t.login.form.email}
                                            margin="normal"
                                            required
                                            fullWidth
                                            value={value}
                                            onChange={onChange}
                                            error={!!error}
                                            helperText={
                                                error ? error.message : null
                                            }
                                        />
                                    )}
                                    rules={{
                                        required: 'E-mail required',
                                        pattern: {
                                            value: REGEXP.EMAIL,
                                            message: 'Invalid e-mail address',
                                        },
                                    }}
                                />
                                <Controller
                                    name={'password'}
                                    control={control}
                                    defaultValue=""
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <TextField
                                            label={t.login.form.password}
                                            fullWidth
                                            required
                                            margin="normal"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={value}
                                            onChange={onChange}
                                            error={!!error}
                                            helperText={
                                                error ? error.message : null
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            edge="end"
                                                            onClick={
                                                                togglePasswordVisibility
                                                            }
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityOffIcon />
                                                            ) : (
                                                                <VisibilityIcon />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                    rules={{
                                        required: 'Password required',
                                        pattern: {
                                            value: REGEXP.PASSWORD,
                                            message:
                                                'Please type using half-width characters',
                                        },
                                        minLength: {
                                            value: 8,
                                            message:
                                                'Password must be at least 8 characters',
                                        },
                                    }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    {t.login.form.login}
                                </Button>
                                <Link href="signup" variant="body2">
                                    {t.login.form.register}
                                </Link>
                            </form>
                        </Box>
                        <SwitchLang path={'/login'} />
                        <Copyright sx={{ mt: 8, mb: 4 }} />
                    </Box>
                </Container>
                <Snackbar
                    open={openSuccessSnackbar}
                    anchorOrigin={snackbarPosition}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert
                        onClose={handleClose}
                        severity="success"
                        sx={{ width: '100%' }}
                    >
                        Success!
                    </Alert>
                </Snackbar>
                <Snackbar
                    open={openErrorSnackbar}
                    anchorOrigin={snackbarPosition}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert
                        onClose={handleClose}
                        severity="error"
                        sx={{ width: '100%' }}
                    >
                        Error! Can not logged in
                    </Alert>
                </Snackbar>
            </ThemeProvider>
        </>
    );
}
