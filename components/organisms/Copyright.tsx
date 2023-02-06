import { Typography } from '@mui/material';
import React from 'react';
import { CopyrightContent } from '../molecules/CopyrightContent';

const Copyright = (props) => {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            <CopyrightContent />
        </Typography>
    );
};

export default Copyright;
