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
import { CONTENT_CATEGORY } from '../general/constants/contentCategory';
import { ImgDataURI } from '../components/atoms/ImgDataURI';

const darkMode = createTheme({
    palette: {
        primary: {
            main: pink[500],
        },
        mode: 'dark',
    },
});

const lightMode = createTheme({});

const Pid = () => {
    const dispatch = useAppDispatch();
    const isAfterLogin = useAppSelector((state) => state.auth.isAfterLogin);
    const dark = useAppSelector((state) => state.ui.dark);
    const contentList = useAppSelector((state) => state.content.list);
    const { t, locale } = useLocale();

    useEffect(() => {
        const init = async () => {
            const token = await asyncLocalStorage.getItem(accessTokenKey);
            const dark = await asyncLocalStorage.getItem(darkModeKey);

            if (!token) {
                return;
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

            const contents = await contentUiController.findByUser();
            dispatch(setContentList(contents));
        };

        init();
    }, []);

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
                                                minHeight:
                                                    'calc((100% / 4) - 48px)',
                                            }}
                                        >
                                            <div className="content-container">
                                                {content.categoryId ===
                                                    CONTENT_CATEGORY.IMAGE && (
                                                    <ImgDataURI
                                                        uri={
                                                            content.deliverables
                                                        }
                                                    />
                                                )}
                                                {content.categoryId ===
                                                    CONTENT_CATEGORY.TEXT && (
                                                    <>{content.deliverables}</>
                                                )}
                                                {content.categoryId !==
                                                    CONTENT_CATEGORY.IMAGE &&
                                                    content.categoryId !==
                                                        CONTENT_CATEGORY.TEXT && (
                                                        <ImgDataURI
                                                            uri={
                                                                content.deliverables
                                                            }
                                                        />
                                                    )}
                                            </div>
                                            <div className="user-info flex p-2 w-full">
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
                                                        {content.prompt}
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

export default Pid;
