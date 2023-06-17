import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ResponsiveDrawer from '../components/template/ResponsiveDrawer';
import { accessTokenKey } from '../general/constants/localStorageKey';
import { asyncLocalStorage } from '../general/utils/asyncLocalStorage';
import { useAppDispatch } from '../redux/hooks';
import { updateIsAfterLogin } from '../redux/reducers/authSlice';
import { updateLoading } from '../redux/reducers/uiSlice';

interface Props {
    statusCode: number;
}
const Error: NextPage<Props> = ({ statusCode }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const init = async () => {
            await asyncLocalStorage.removeItem(accessTokenKey);
            dispatch(updateIsAfterLogin(false));
            dispatch(updateLoading(false));
        };

        init();
    }, []);

    return (
        <ResponsiveDrawer
            isDetail={false}
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
