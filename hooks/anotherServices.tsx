import Router from 'next/router';
import { accessTokenKey } from '../general/constants/localStorageKey';
import { asyncLocalStorage } from '../general/utils/asyncLocalStorage';
import { useLocale } from './useLocale';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import HomeIcon from '@mui/icons-material/Home';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TwitterIcon from '@mui/icons-material/Twitter';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { useAppSelector } from '../redux/hooks';

export const useAnotherServices = () => {
    const { t, locale } = useLocale();
    const dark = useAppSelector((state) => state.ui.dark);

    const anotherServices = [
        {
            title: t.leftNav.homepage,
            link:
                locale === 'en'
                    ? 'https://www.deep-recommend.com'
                    : 'https://www.deep-recommend.com/ja',
            iconElement: <HomeIcon />,
        },
        {
            title: t.leftNav.discord,
            link: 'https://discord.gg/QjSFUCzDn5',
            iconElement: (
                <FontAwesomeIcon
                    icon={faDiscord}
                    style={{
                        color: dark ? '#ffffff' : '#888888',
                        width: '1em',
                        height: '1em',
                        fontSize: '1.5rem',
                    }}
                />
            ),
        },
        {
            title: t.leftNav.twitter,
            link:
                locale === 'en'
                    ? 'https://twitter.com/Deepia999'
                    : 'https://twitter.com/DeepiaJP',
            iconElement: <TwitterIcon />,
        },
        {
            title: t.leftNav.feedback,
            link:
                locale === 'en'
                    ? 'https://www.deep-recommend.com/feedback'
                    : 'https://www.deep-recommend.com/ja/feedback',
            iconElement: <FeedbackIcon />,
        },
    ];

    return anotherServices;
};
