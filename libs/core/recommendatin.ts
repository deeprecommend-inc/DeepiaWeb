import { asyncApiClient } from './api.client';

export const recommendationApi = async () => {
    const apiClient = await asyncApiClient.create();
    const res = await apiClient.get<string[]>('/recommendation/');
    return res.data;
};
