import '../styles/globals.scss';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { accessTokenKey } from '../general/constants/localStorageKey';
import { asyncLocalStorage } from '../general/utils/asyncLocalStorage';
import { useRouter } from 'next/router';
import ResponsiveDrawer from '../components/template/ResponsiveDrawer';
import LoadingOverlay from '../components/template/LoadingOverlay';

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
    const router = useRouter();

    return (
        <Provider store={store}>
            <SessionProvider session={session}>
                <LoadingOverlay />
                <Component {...pageProps} />
            </SessionProvider>
        </Provider>
    );
};

export default MyApp;
