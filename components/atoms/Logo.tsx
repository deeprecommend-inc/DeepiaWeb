import React, { useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';

export const Logo = () => {
    const dark = useAppSelector((state) => state.ui.dark);
    const isAfterLogin = useAppSelector((state) => state.auth.isAfterLogin);

    const clickLogo = () => {
        return false;
    };

    return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
            src={
                dark &&
                location.pathname !== '/login' &&
                location.pathname !== '/signup'
                    ? '/logo-white.png'
                    : '/logo.png'
            }
            className="w-12"
            onContextMenu={clickLogo}
        />
    );
};

export default Logo;
