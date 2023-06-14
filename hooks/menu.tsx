import Router from 'next/router';
import { accessTokenKey } from '../general/constants/localStorageKey';
import { asyncLocalStorage } from '../general/utils/asyncLocalStorage';
import { useLocale } from './useLocale';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import HomeIcon from '@mui/icons-material/Home';
import FeedbackIcon from '@mui/icons-material/Feedback';
import React from 'react';
import ExploreIcon from '@mui/icons-material/Explore';
import VideocamIcon from '@mui/icons-material/Videocam';

export const useMenus = () => {
    const { t } = useLocale();
    const menus = [
        {
            title: t.leftNav.home,
            link: '/',
            iconElement: <HomeIcon />,
        },
        {
            title: t.leftNav.following,
            link: '/following',
            iconElement: <GroupIcon />,
            disabled: true,
        },
        {
            title: t.leftNav.explore,
            link: '/explore',
            iconElement: <ExploreIcon />,
            disabled: true,
        },
        {
            title: t.leftNav.live,
            link: '/live',
            iconElement: <VideocamIcon />,
            disabled: true,
        },
    ];

    return menus;
};
