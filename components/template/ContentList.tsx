import { Avatar, Grid } from '@mui/material';
import React from 'react';
import { ImgDataURI } from '../atoms/ImgDataURI';
import SimpleBar from 'simplebar-react';
import {
    contentCategoryIds,
    CONTENT_CATEGORY,
} from '../../general/constants/contentCategory';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ContentMenu from '../../components/atoms/menu/ContentMenu';
import { useAppSelector } from '../../redux/hooks';
import LogoGray from '../atoms/LogoGray';
import { useMediaQuery, useTheme } from '@mui/material';

type Props = {
    onDelete: (id) => void;
};

const ContentList = ({ onDelete }: Props) => {
    const dark = useAppSelector((state) => state.ui.dark);
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const contentList = useAppSelector((state) => state.content.list);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Grid
                container
                sx={{
                    padding: isMobile ? '88px 24px 24px' : '88px 64px 24px',
                    gap: '24px',
                }}
            >
                {contentList.map((content, index) => (
                    <Grid
                        item
                        key={index}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={2.5}
                        sx={{
                            width: 'calc((100% / 4) - 48px)',
                            minHeight: 'calc((100% / 4) - 48px)',
                            borderRadius: '24px',
                            position:
                                content.categoryId === CONTENT_CATEGORY.TEXT
                                    ? 'relative'
                                    : '',
                            scrollY: 'hidden',
                        }}
                    >
                        <div
                            className="content-container"
                            style={
                                content.categoryId === CONTENT_CATEGORY.TEXT
                                    ? {
                                          paddingTop: '100%',
                                          position: 'relative',
                                      }
                                    : {}
                            }
                        >
                            {content.deliverables && (
                                <>
                                    {content.categoryId ===
                                        CONTENT_CATEGORY.IMAGE && (
                                        <ImgDataURI
                                            uri={content.deliverables}
                                        />
                                    )}
                                    {content.categoryId ===
                                        CONTENT_CATEGORY.TEXT && (
                                        <SimpleBar
                                            className="simplebar"
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                height: '100%',
                                                flexGrow: 1,
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word',
                                                overflowY: 'scroll',
                                                overflowX: 'hidden',
                                                borderRadius: '12px',
                                            }}
                                        >
                                            <ReactMarkdown
                                                // eslint-disable-next-line react/no-children-prop
                                                children={content.deliverables}
                                                remarkPlugins={[remarkGfm]}
                                            />
                                        </SimpleBar>
                                    )}
                                    {content.categoryId !==
                                        CONTENT_CATEGORY.IMAGE &&
                                        content.categoryId !==
                                            CONTENT_CATEGORY.TEXT &&
                                        contentCategoryIds.includes(
                                            content.categoryId,
                                        ) && <LogoGray />}
                                </>
                            )}
                            {!content.deliverables &&
                                !contentCategoryIds.includes(
                                    content.categoryId,
                                ) && <LogoGray />}
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
                                            fontSize: '20px',
                                            fontWeight: 500,
                                            overflow: 'hidden',
                                            display: 'block',
                                            maxHeight: '4rem',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'normal',
                                        }}
                                    >
                                        {content.prompt}
                                    </h1>
                                    <p>{content.user.name}</p>
                                </div>
                            </div>

                            <div>
                                <ContentMenu
                                    content={content}
                                    currentUserId={currentUser?.id ?? 0}
                                    onDelete={() => {
                                        onDelete(content.id);
                                    }}
                                />
                            </div>
                        </div>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default ContentList;
