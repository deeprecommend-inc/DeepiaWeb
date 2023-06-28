import React, { useState } from 'react';
import {
    AppBar,
    Chip,
    Tab,
    Tabs,
    Toolbar,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { CONTENT_CATEGORY } from '../../general/constants/contentCategory';
import { useLocale } from '../../hooks/useLocale';
import { contentUiController } from '../../libs/content/presentation/content.ui.controler';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setContentList } from '../../redux/reducers/contentSlice';
import { updateLoading } from '../../redux/reducers/uiSlice';

const ToolbarMenu = () => {
    const { t, locale } = useLocale();
    const dispatch = useAppDispatch();
    const dark = useAppSelector((state) => state.ui.dark);
    const [value, setValue] = useState(0);

    const narrowDown = async (categoryId?: number) => {
        dispatch(updateLoading(true));

        if (categoryId === undefined) {
            const contents = await contentUiController.findAll();
            dispatch(setContentList(contents));
        } else {
            const contents = await contentUiController.find({
                categoryId,
            });
            dispatch(setContentList(contents));
        }

        dispatch(updateLoading(false));
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        if (newValue === 0) {
            narrowDown();
        } else if (newValue === 1) {
            narrowDown(CONTENT_CATEGORY.IMAGE);
        } else if (newValue === 2) {
            narrowDown(CONTENT_CATEGORY.TEXT);
        } else if (newValue === 3) {
            narrowDown(CONTENT_CATEGORY.MUSIC);
        } else if (newValue === 4) {
            narrowDown(CONTENT_CATEGORY.VIDEO);
        } else if (newValue === 5) {
            narrowDown(CONTENT_CATEGORY.SPACE);
        }
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Toolbar
            className={`gap-4 fixed w-full z-50 ${isMobile ? 'flex-wrap' : ''}`}
            style={{
                background: dark ? '#121212' : '#ffffff',
            }}
        >
            {isMobile ? (
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="content tabs"
                >
                    <Tab
                        label={t.all}
                        sx={{
                            minWidth: 'auto',
                            width: 'auto',
                            px: 1,
                        }}
                    />
                    <Tab
                        label={t.image}
                        sx={{
                            minWidth: 'auto',
                            width: 'auto',
                            px: 1,
                        }}
                    />
                    <Tab
                        label={t.text}
                        sx={{
                            minWidth: 'auto',
                            width: 'auto',
                            px: 1,
                        }}
                    />
                    <Tab
                        label={t.music}
                        disabled
                        sx={{
                            minWidth: 'auto',
                            width: 'auto',
                            px: 1,
                        }}
                    />
                    <Tab
                        label={t.video}
                        disabled
                        sx={{
                            minWidth: 'auto',
                            width: 'auto',
                            px: 1,
                        }}
                    />
                    <Tab
                        label={t.space}
                        disabled
                        sx={{
                            minWidth: 'auto',
                            width: 'auto',
                            px: 1,
                        }}
                    />
                </Tabs>
            ) : (
                <>
                    <Chip
                        label={t.all}
                        variant="outlined"
                        onClick={() => {
                            narrowDown();
                        }}
                    />
                    <Chip
                        label={t.image}
                        variant="outlined"
                        onClick={() => {
                            narrowDown(CONTENT_CATEGORY.IMAGE);
                        }}
                    />
                    <Chip
                        label={t.text}
                        variant="outlined"
                        onClick={() => {
                            narrowDown(CONTENT_CATEGORY.TEXT);
                        }}
                    />
                    <Chip
                        label={t.music}
                        variant="outlined"
                        onClick={() => {
                            narrowDown(CONTENT_CATEGORY.MUSIC);
                        }}
                        disabled={true}
                    />
                    <Chip
                        label={t.video}
                        variant="outlined"
                        onClick={() => {
                            narrowDown(CONTENT_CATEGORY.VIDEO);
                        }}
                        disabled={true}
                    />
                    <Chip
                        label={t.space}
                        variant="outlined"
                        onClick={() => {
                            narrowDown(CONTENT_CATEGORY.SPACE);
                        }}
                        disabled={true}
                    />
                </>
            )}
        </Toolbar>
    );
};

export default ToolbarMenu;
