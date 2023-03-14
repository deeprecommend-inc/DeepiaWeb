import React, { useEffect } from 'react';
import { Box } from '@mui/system';
import router, { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    setCurrentUser,
    updateIsAfterLogin,
} from '../redux/reducers/authSlice';
import { NextSeo } from 'next-seo';
import ResponsiveDrawer from '../components/template/ResponsiveDrawer';
import { authUiController } from '../libs/auth/presentation/auth.ui.controller';
import { useSession, signIn, signOut } from 'next-auth/react';
import { asyncLocalStorage } from '../general/utils/asyncLocalStorage';
import {
    accessTokenKey,
    categoryIdForGetLogKey,
    darkModeKey,
} from '../general/constants/localStorageKey';
import { pink } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { setDark } from '../redux/reducers/uiSlice';
import { useLocale } from '../hooks/useLocale';
import { Avatar, Chip, Grid, Toolbar } from '@mui/material';

const darkMode = createTheme({
    palette: {
        primary: {
            main: pink[500],
        },
        mode: 'dark',
    },
});

const lightMode = createTheme({});

const Home = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isAfterLogin = useAppSelector((state) => state.auth.isAfterLogin);
    const dark = useAppSelector((state) => state.ui.dark);
    const { t, locale } = useLocale();

    useEffect(() => {
        const init = async () => {
            const token = await asyncLocalStorage.getItem(accessTokenKey);
            const dark = await asyncLocalStorage.getItem(darkModeKey);

            if (!token) {
                // await asyncLocalStorage.removeItem(accessTokenKey);
                // router.push("login");
                // return;
            } else {
                dispatch(updateIsAfterLogin(true));
                await authUiController.currentUser().then((currentUser) => {
                    dispatch(setCurrentUser(currentUser));
                });
            }

            if (!isAfterLogin) {
                await authUiController.currentUser().then((currentUser) => {
                    dispatch(setCurrentUser(currentUser));
                });
            }

            Boolean(dark)
                ? await dispatch(setDark(true))
                : await dispatch(setDark(false));
        };

        init();
    }, []);

    const narrowDown = (num: number) => {};

    return (
        <>
            <NextSeo
                title={t.index.head.title}
                description={t.index.head.description}
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
                <Box
                    className={`h-screen overflow-scroll ${
                        dark ? 'dark' : 'light'
                    }`}
                    onContextMenu={(e) => {
                        e.preventDefault();
                    }}
                >
                    <ResponsiveDrawer
                        contents={
                            <>
                                <Toolbar className="gap-4 fixed bg-white w-full z-50">
                                    <Chip
                                        label={t.all}
                                        variant="outlined"
                                        onClick={() => {
                                            narrowDown(0);
                                        }}
                                    />
                                    <Chip
                                        label={t.image}
                                        variant="outlined"
                                        onClick={() => {
                                            narrowDown(1);
                                        }}
                                    />
                                    <Chip
                                        label={t.text}
                                        variant="outlined"
                                        onClick={() => {
                                            narrowDown(2);
                                        }}
                                    />
                                    <Chip
                                        label={t.music}
                                        variant="outlined"
                                        onClick={() => {
                                            narrowDown(3);
                                        }}
                                    />
                                    {/* <Chip
                    label={t.video}
                    variant="outlined"
                    onClick={() => {
                      narrowDown(4);
                    }}
                  /> */}
                                </Toolbar>
                                <Grid
                                    container
                                    sx={{
                                        padding: '88px 64px 24px',
                                        gap: '24px',
                                    }}
                                >
                                    {[
                                        {
                                            title: 'Unkoman',
                                            img: '/images/test1.png',
                                            user: {
                                                name: 'DeepRecommend',
                                                image: '/images/test12.png',
                                            },
                                        },
                                        {
                                            title: 'I am very lucky',
                                            img: '/images/test2.png',
                                            user: {
                                                name: 'Jin Sugimoto',
                                                image: '/images/test11.png',
                                            },
                                        },
                                        {
                                            title: 'chanchan charachara',
                                            img: '/images/test3.png',
                                            user: {
                                                name: 'AI man',
                                                image: '/images/test10.png',
                                            },
                                        },
                                        {
                                            title: 'CCCCC',
                                            img: '/images/test4.png',
                                            user: {
                                                name: 'Unkown',
                                                image: '/images/test9.png',
                                            },
                                        },
                                        {
                                            title: 'Nekoni koban',
                                            img: '/images/test5.png',
                                            user: {
                                                name: 'Kabochan',
                                                image: '/images/test8.png',
                                            },
                                        },
                                        {
                                            title: 'HHH',
                                            img: '/images/test6.png',
                                            user: {
                                                name: 'Sobakasu',
                                                image: '/images/test7.png',
                                            },
                                        },
                                        {
                                            title: 'Quick',
                                            img: '/images/test7.png',
                                            user: {
                                                name: 'Nikibi',
                                                image: '/images/test6.png',
                                            },
                                        },
                                        {
                                            title: 'Bird',
                                            img: '/images/test8.png',
                                            user: {
                                                name: 'Mohikan',
                                                image: '/images/test5.png',
                                            },
                                        },
                                        {
                                            title: 'Black Sigma',
                                            img: '/images/test9.png',
                                            user: {
                                                name: 'Yamamoto',
                                                image: '/images/test4.png',
                                            },
                                        },
                                        {
                                            title: 'Killer',
                                            img: '/images/test10.png',
                                            user: {
                                                name: 'WaqWaqSan',
                                                image: '/images/test3.png',
                                            },
                                        },
                                        {
                                            title: 'Random',
                                            img: '/images/test11.png',
                                            user: {
                                                name: 'ChiChiSibori',
                                                image: '/images/test2.png',
                                            },
                                        },
                                        {
                                            title: 'Easy pencil',
                                            img: '/images/test12.png',
                                            user: {
                                                name: 'Kosan',
                                                image: '/images/test1.png',
                                            },
                                        },
                                    ].map((content, index) => (
                                        <Grid
                                            item
                                            key={index}
                                            sx={{
                                                width: 'calc((100% / 4) - 48px)',
                                            }}
                                        >
                                            <img src={content.img} />
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    padding: '8px',
                                                }}
                                            >
                                                <Avatar
                                                    src={content.user.image}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                    }}
                                                />
                                                <div className="pl-2">
                                                    <h1
                                                        style={{
                                                            fontSize: '20px',
                                                            fontWeight: 500,
                                                            overflow: 'hidden',
                                                            display: 'block',
                                                            maxHeight: '4rem',
                                                            textOverflow:
                                                                'ellipsis',
                                                            whiteSpace:
                                                                'normal',
                                                        }}
                                                    >
                                                        {content.title}
                                                    </h1>
                                                    <p>{content.user.name}</p>
                                                </div>
                                            </div>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        }
                    />
                </Box>
            </ThemeProvider>
        </>
    );
};

export default Home;
