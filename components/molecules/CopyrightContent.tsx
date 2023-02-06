import React from 'react';
import CopyrightLink from '../atoms/CopyrightLink';
import CopyrightText from '../atoms/Copyright';
import FullYear from '../atoms/FullYear';

export const CopyrightContent = () => {
    return (
        <>
            <CopyrightText />
            <CopyrightLink /> <FullYear></FullYear>
            {'.'}
        </>
    );
};
