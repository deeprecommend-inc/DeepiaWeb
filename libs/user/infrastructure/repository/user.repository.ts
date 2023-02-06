import { asyncApiClient } from '../../../core/api.client';
import { User } from '../../domain/user';
import { UserRepo } from '../../domain/user.repository';
import { UserDto } from '../../session/dto/user.dto';
import { UserMapper } from '../../session/mapper/user.mapper';
import { UserModel } from '../datasource/user.model';

export const userRepo: UserRepo = {
    findAll: async (): Promise<UserDto[]> => {
        const apiClient = await asyncApiClient.create();
        const res = await apiClient.get<UserModel[]>('/user/');
        const dto = res.data.map((o) => UserMapper.toDto(o));
        return dto;
    },
    findOne: async (id: number): Promise<UserDto> => {
        const apiClient = await asyncApiClient.create();
        const res = await apiClient.get<UserModel>(`/user/${id}/`);
        const dto = UserMapper.toDto(res.data);
        return dto;
    },
    isUniqueEmail: async (domain: User): Promise<boolean> => {
        const apiClient = await asyncApiClient.create();
        const model = await UserMapper.toPersistence(domain);
        const res = await apiClient.post<UserModel>(
            '/user/is_unique_email/',
            model,
        );
        const isUniqueEmail = Boolean(res.data);
        return isUniqueEmail;
    },
    create: async (domain: User): Promise<void> => {
        const apiClient = await asyncApiClient.create();
        const model = await UserMapper.toPersistence(domain);
        await apiClient.post<void>('/user/', model);
    },
    update: async (id: number, domain: User): Promise<void> => {
        const apiClient = await asyncApiClient.create();
        const model = await UserMapper.toPersistence(domain);
        console.log({ model });
        await apiClient.put<void>(`/user/${id}/`, model);
    },
    delete: async (id: number): Promise<void> => {
        const apiClient = await asyncApiClient.create();
        await apiClient.delete<void>(`/user/${id}/`);
    },
};
