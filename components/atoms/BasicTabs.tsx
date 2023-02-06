import { Box, Tab } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { a11yProps } from '../../general/functions/a11yProps';
import Tabs from '@mui/material/Tabs';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateTabNum } from '../../redux/reducers/uiSlice';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { asyncLocalStorage } from '../../general/utils/asyncLocalStorage';
import { lastTabKey } from '../../general/constants/localStorageKey';
import AppsIcon from '@mui/icons-material/Apps';
import { useLocale } from '../../hooks/useLocale';
import RecommendIcon from '@mui/icons-material/Recommend';

export const BasicTabs = () => {
    const dispatch = useAppDispatch();
    const { t } = useLocale();
    const tabNum = useAppSelector((state) => state.ui.tabNum);

    useEffect(() => {
        const init = async () => {
            const lastTab = await asyncLocalStorage.getItem(lastTabKey);
            dispatch(updateTabNum(Number(lastTab) ?? 0));
        };

        init();
    }, []);

    const handleChange = async (
        event: React.SyntheticEvent,
        newValue: number,
    ) => {
        await asyncLocalStorage.setItem(lastTabKey, String(newValue));
        dispatch(updateTabNum(newValue));
    };

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                onChange={handleChange}
                orientation="vertical"
                value={tabNum}
                aria-label="basic tabs example"
            >
                <Tab
                    icon={<GridViewIcon />}
                    iconPosition="start"
                    label={t.leftNav.category}
                    {...a11yProps(0)}
                />
                <Tab
                    icon={<ViewListIcon />}
                    iconPosition="start"
                    label={t.leftNav.tableList}
                    {...a11yProps(1)}
                />
                {/* <Tab
                    icon={<AppsIcon />}
                    iconPosition="start"
                    label={t.leftNav.iconList}
                    {...a11yProps(2)}
                ></Tab>
                <Tab
                    icon={<RecommendIcon />}
                    iconPosition="start"
                    label={t.leftNav.recommendation}
                    {...a11yProps(3)}
                ></Tab>
                <Tab
                    icon={<BrandingWatermarkIcon />}
                    iconPosition="start"
                    label={t.leftNav.embedded}
                    {...a11yProps(4)}
                /> */}
            </Tabs>
        </Box>
    );
};

export default Tab;
