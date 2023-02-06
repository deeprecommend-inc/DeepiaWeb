import React from 'react';
import Box from '@mui/material/Box';

type Props = {
    children?: React.ReactNode;
    index: number;
    tabNum: number;
};

const TabPanel = (props: Props) => {
    const { children, tabNum, index, ...other } = props;

    if (tabNum !== index) return <></>;

    return (
        <div
            role="tabpanel"
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {tabNum === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

export default TabPanel;
