import { HeadCell } from '../interfaces/HeadCell';

export const headCells: readonly HeadCell[] = [
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'Order',
    },
    {
        id: 'title',
        numeric: true,
        disablePadding: false,
        label: 'Title',
    },
    {
        id: 'link',
        numeric: true,
        disablePadding: false,
        label: 'Link',
    },
    {
        id: 'copy',
        numeric: false,
        disablePadding: false,
        label: 'Copy',
    },
    {
        id: 'iFrame',
        numeric: true,
        disablePadding: false,
        label: 'iFrame',
    },
    {
        id: 'category',
        numeric: true,
        disablePadding: false,
        label: 'Category',
    },
    {
        id: 'edit',
        numeric: true,
        disablePadding: false,
        label: 'Edit',
    },
];
