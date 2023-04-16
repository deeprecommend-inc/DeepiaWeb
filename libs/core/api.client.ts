import axios, { AxiosInstance } from 'axios';
import { accessTokenKey } from '../../general/constants/localStorageKey';
import { asyncLocalStorage } from '../../general/utils/asyncLocalStorage';

export const asyncApiClient = {
    create: async () => {
        const client = await axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${await asyncLocalStorage.getItem(
                    accessTokenKey,
                )}`,
            },
        });

        client.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response && error.response.status === 500) {
                    await asyncLocalStorage.removeItem(accessTokenKey);
                }
                return Promise.reject(error);
            },
        );

        return client;
    },
};
