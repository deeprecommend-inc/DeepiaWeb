import Router from 'next/router';
import { accessTokenKey } from '../general/constants/localStorageKey';
import { asyncLocalStorage } from '../general/utils/asyncLocalStorage';

type Props = {
    children: any;
};

export const ProtectRoute = async (props: Props) => {
    const { children } = props;

    if (typeof window !== 'undefined') {
        const token = await asyncLocalStorage.getItem(accessTokenKey);

        if (!token) {
            Router.push('login');
        }
    }
    return children;
};
