import React from 'react';
import CopyrightLink from '../atoms/CopyrightLink';
import CopyrightText from '../atoms/Copyright';
import FullYear from '../atoms/FullYear';
import { Typography } from '@mui/material';

interface Props {
    className?: string;
}

export const CopyrightContent = (props: Props) => {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            className={props?.className}
        >
            <CopyrightText />
            <FullYear />
            <CopyrightLink />
        </Typography>
    );
};
