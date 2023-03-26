import React, { useEffect, useState } from 'react';
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
import ToolbarMenu from '../components/template/ToolbarMenu';
import { contentUiController } from '../libs/content/presentation/content.ui.controler';
import { setContentList } from '../redux/reducers/contentSlice';

const darkMode = createTheme({
    palette: {
        primary: {
            main: pink[500],
        },
        mode: 'dark',
    },
});

const lightMode = createTheme({});

const Home = ({ contents }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isAfterLogin = useAppSelector((state) => state.auth.isAfterLogin);
    const contentList = useAppSelector((state) => state.content.list);
    const dark = useAppSelector((state) => state.ui.dark);
    const { t, locale } = useLocale();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            setReady(true);

            const token = await asyncLocalStorage.getItem(accessTokenKey);
            const dark = await asyncLocalStorage.getItem(darkModeKey);
            const contents = await contentUiController.findAll();
            console.log({ contents });

            if (token || !isAfterLogin) {
                const currentUser = await authUiController.currentUser();
                dispatch(setCurrentUser(currentUser));
                dispatch(updateIsAfterLogin(true));
            }

            Boolean(dark)
                ? await dispatch(setDark(true))
                : await dispatch(setDark(false));

            dispatch(setContentList(contents));
        };

        init();
    }, []);

    if (!ready) return <></>;

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
                                <Grid
                                    container
                                    sx={{
                                        padding: '88px 64px 24px',
                                        gap: '24px',
                                    }}
                                >
                                    {contentList.map((content, index) => (
                                        <Grid
                                            item
                                            key={index}
                                            sx={{
                                                width: 'calc((100% / 4) - 48px)',
                                            }}
                                        >
                                            <img
                                                src={
                                                    'data:image/png;base64,' +
                                                    content.deliverables
                                                }
                                            />
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

export const getServerSideProps = async () => {
    const contents = [
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
    ];

    return {
        props: { contents },
    };
};

export default Home;
