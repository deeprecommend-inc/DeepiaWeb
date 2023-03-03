import '../styles/globals.scss';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { accessTokenKey } from '../general/constants/localStorageKey';
import { asyncLocalStorage } from '../general/utils/asyncLocalStorage';
import { useRouter } from 'next/router';

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
    const router = useRouter();

    useEffect(() => {
        window.addEventListener('storage', async (event) => {
            const token = await asyncLocalStorage.getItem(accessTokenKey);
            if (!token) {
                await asyncLocalStorage.removeItem(accessTokenKey);
                router.push('login');
                return;
            }
        });
    });

    return (
        <Provider store={store}>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </Provider>
    );
};

export default MyApp;
