import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ResponsiveDrawer from '../components/template/ResponsiveDrawer';
import { accessTokenKey } from '../general/constants/localStorageKey';
import { asyncLocalStorage } from '../general/utils/asyncLocalStorage';

interface Props {
    statusCode: number;
}
const Error: NextPage<Props> = ({ statusCode }) => {
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            await asyncLocalStorage.removeItem(accessTokenKey);
            router.push('login');
        };

        init();
    }, []);

    return (
        <ResponsiveDrawer
            contents={
                <>
                    <div>{statusCode} error</div>
                </>
            }
        />
    );
};

Error.getInitialProps = async ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode ?? 500 : 404;

    return { statusCode };
};

export default Error;
