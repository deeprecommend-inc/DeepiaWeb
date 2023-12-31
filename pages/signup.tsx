import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { CreateUserDto } from '../libs/user/session/dto/create.user.dto';
import { userUiController } from '../libs/user/presentation/user.ui.controller';
import { REGEXP } from '../general/utils/regExp';
import ReactPlayer from 'react-player';
import Logo from '../components/atoms/Logo';
import {
    Snackbar,
    Alert,
    SnackbarOrigin,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Copyright from '../components/organisms/Copyright';
import { NextSeo } from 'next-seo';
import { useLocale } from '../hooks/useLocale';
import { SwitchLang } from '../components/atoms/SwitchLang';
import Container from '@mui/material/Container';
import { darkMode, lightMode } from '../general/constants/theme';
import { RootState } from '../redux/store';
import { setDark } from '../redux/reducers/uiSlice';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

type SignUpUser = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
};

const theme = createTheme();

const snackbarPosition: SnackbarOrigin = {
    vertical: 'top',
    horizontal: 'right',
};

export default function SignInSide() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { handleSubmit, control, reset, setValue } = useForm();
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const { t, locale } = useLocale();
    const dark = useAppSelector((state: RootState) => state.ui.dark);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

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

    const togglePasswordConfirmationVisibility = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    const onSubmit = async (data: SignUpUser) => {
        const isUniqueEmail = await userUiController.isUniqueEmail({
            email: data.email,
        });

        if (isUniqueEmail) {
            const newUser = new CreateUserDto();
            newUser.name = data.name;
            newUser.email = data.email;
            newUser.password = data.password;

            await userUiController.create(newUser);

            successSnackbar();
            router.push('/login');
        } else {
            errorSnackbar();
        }
    };

    return (
        <>
            <NextSeo
                title={t.signup.head.title}
                description={t.signup.head.description}
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
                    {/* @ts-ignore */}
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
                                    name={'name'}
                                    control={control}
                                    defaultValue=""
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <TextField
                                            className="text-white"
                                            label={t.signup.form.name}
                                            margin="normal"
                                            fullWidth
                                            required
                                            value={value}
                                            onChange={onChange}
                                            error={!!error}
                                            helperText={
                                                error ? error.message : null
                                            }
                                        />
                                    )}
                                    rules={{
                                        required: 'Name required',
                                        maxLength: {
                                            value: 32,
                                            message: 'Max length exceded',
                                        },
                                        pattern: {
                                            value: REGEXP.UNIQUE_NAME,
                                            message:
                                                'Only alphanumeric characters and symbols are allowed',
                                        },
                                    }}
                                />
                                <Controller
                                    name={'email'}
                                    control={control}
                                    defaultValue=""
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <TextField
                                            label={t.signup.form.email}
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
                                            label={t.signup.form.password}
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
                                <Controller
                                    name={'passwordConfirmation'}
                                    control={control}
                                    defaultValue=""
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <TextField
                                            label={
                                                t.signup.form
                                                    .passwordConfirmation
                                            }
                                            fullWidth
                                            required
                                            margin="normal"
                                            type={
                                                showPasswordConfirmation
                                                    ? 'text'
                                                    : 'password'
                                            } // change type based on visibility
                                            value={value}
                                            onChange={onChange}
                                            error={!!error}
                                            helperText={
                                                error ? error.message : null
                                            }
                                            InputProps={{
                                                // Add the eye icon
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            edge="end"
                                                            onClick={
                                                                togglePasswordConfirmationVisibility
                                                            }
                                                        >
                                                            {showPasswordConfirmation ? (
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
                                        required:
                                            'Password confirmation required',
                                        validate: (input) =>
                                            input ===
                                            control._formValues.password
                                                ? (null as any)
                                                : 'Password does not matched',
                                    }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign up
                                </Button>
                                <Link href="login" variant="body2">
                                    {t.signup.form.login}
                                </Link>
                                <SwitchLang path={'/signup'} />
                                <Copyright sx={{ mt: 5 }} />
                            </form>
                        </Box>
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
                        Error! Email is not unique
                    </Alert>
                </Snackbar>
            </ThemeProvider>
        </>
    );
}
