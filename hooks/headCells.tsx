import Router from 'next/router';
import { accessTokenKey } from '../general/constants/localStorageKey';
import { asyncLocalStorage } from '../general/utils/asyncLocalStorage';
import { useLocale } from './useLocale';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import HomeIcon from '@mui/icons-material/Home';
import React from 'react';
import { HeadCell } from '../general/interfaces/HeadCell';

export const useHeadCells = () => {
    const { t } = useLocale();
    const headCells: readonly HeadCell[] = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: t.favicon,
        },
        {
            id: 'title',
            numeric: true,
            disablePadding: false,
            label: t.log.title,
        },
        {
            id: 'link',
            numeric: true,
            disablePadding: false,
            label: t.log.link,
        },
        {
            id: 'copy',
            numeric: false,
            disablePadding: false,
            label: t.menu.copy,
        },
        {
            id: 'iFrame',
            numeric: true,
            disablePadding: false,
            label: t.menu.iFrame,
        },
        {
            id: 'category',
            numeric: true,
            disablePadding: false,
            label: t.menu.category,
        },
        {
            id: 'edit',
            numeric: true,
            disablePadding: false,
            label: t.menu.edit,
        },
    ];

    return headCells;
};
