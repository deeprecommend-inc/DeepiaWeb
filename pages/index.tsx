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
    langKey,
} from '../general/constants/localStorageKey';
import { pink, deepPurple } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { setDark, setLang, updateLoading } from '../redux/reducers/uiSlice';
import { useLocale } from '../hooks/useLocale';
import {
    Avatar,
    Chip,
    Grid,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
} from '@mui/material';
import ToolbarMenu from '../components/template/ToolbarMenu';
import { contentUiController } from '../libs/content/presentation/content.ui.controler';
import { setContentList } from '../redux/reducers/contentSlice';
import { CONTENT_CATEGORY } from '../general/constants/contentCategory';
import { ImgDataURI } from '../components/atoms/ImgDataURI';
import SimpleBar from 'simplebar-react';
import { darkMode, lightMode } from '../general/constants/theme';
import ContentMenu from '../components/atoms/menu/ContentMenu';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Home = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isAfterLogin = useAppSelector((state) => state.auth.isAfterLogin);
    const contentList = useAppSelector((state) => state.content.list);
    const dark = useAppSelector((state) => state.ui.dark);
    const { t, locale } = useLocale();
    const [ready, setReady] = useState(false);
    const currentUser = useAppSelector((state) => state.auth.currentUser);

    useEffect(() => {
        const init = async () => {
            setReady(true);

            dispatch(updateLoading(true));

            const token = await asyncLocalStorage.getItem(accessTokenKey);
            const dark = await asyncLocalStorage.getItem(darkModeKey);
            const lang = await asyncLocalStorage.getItem(langKey);

            if (token && !isAfterLogin) {
                const currentUser = await authUiController.currentUser();
                dispatch(setCurrentUser(currentUser));
                dispatch(updateIsAfterLogin(true));
            }

            if (dark) {
                await dispatch(setDark(true));
            } else {
                await dispatch(setDark(false));
            }

            if (lang) {
                await dispatch(setLang(lang));
            } else {
                await dispatch(setLang('en'));
            }

            getContents();
        };

        init();
    }, []);

    const getContents = async () => {
        const contents = await contentUiController.findAll();
        dispatch(setContentList(contents));

        dispatch(updateLoading(false));
    };

    const deleteContent = async (id: number) => {
        dispatch(updateLoading(true));

        await contentUiController.delete(id);
        await getContents();
    };

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
                        isDetail={false}
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
                                                    <SimpleBar
                                                        style={{
                                                            width: '350px',
                                                            height: '350px',
                                                            wordWrap:
                                                                'break-word',
                                                            overflowWrap:
                                                                'break-word',
                                                            overflowY: 'auto',
                                                            overflowX: 'hidden',
                                                        }}
                                                    >
                                                        <ReactMarkdown
                                                            // eslint-disable-next-line react/no-children-prop
                                                            children={
                                                                content.deliverables
                                                            }
                                                            remarkPlugins={[
                                                                remarkGfm,
                                                            ]}
                                                        />
                                                    </SimpleBar>
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
                                            <div className="user-info flex justify-between p-2 w-full">
                                                <div className="flex ">
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
                                                                fontSize:
                                                                    '20px',
                                                                fontWeight: 500,
                                                                overflow:
                                                                    'hidden',
                                                                display:
                                                                    'block',
                                                                maxHeight:
                                                                    '4rem',
                                                                textOverflow:
                                                                    'ellipsis',
                                                                whiteSpace:
                                                                    'normal',
                                                            }}
                                                        >
                                                            {content.prompt}
                                                        </h1>
                                                        <p>
                                                            {content.user.name}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <ContentMenu
                                                        contentId={content.id}
                                                        contentUserId={
                                                            content.user.id
                                                        }
                                                        currentUserId={
                                                            currentUser?.id ?? 0
                                                        }
                                                        prompt={content.prompt}
                                                        onDelete={() => {
                                                            deleteContent(
                                                                content.id,
                                                            );
                                                        }}
                                                    />
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
