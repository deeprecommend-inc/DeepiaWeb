import { asyncApiClient } from '../../../core/api.client';
import { AuthLogin } from '../../domain/auth.login';
import { AuthRepo } from '../../domain/auth.repository';
import { AuthCurrentUserDto } from '../../session/dto/auth.current.user.dto';
import { AuthTokenDto } from '../../session/dto/auth.token.dto';
import { AuthCurrentUserMapper } from '../../session/mapper/auth.current.user.mapper';
import { AuthLoginMapper } from '../../session/mapper/auth.login.mapper';
import { AuthTokenMapper } from '../../session/mapper/auth.token.mapper';
import { AuthCurrentUserModel } from '../datasource/auth.current.user.model';
import { AuthTokenModel } from '../datasource/auth.token.model';

export const authRepo: AuthRepo = {
    currentUser: async (): Promise<AuthCurrentUserDto> => {
        const apiClient = await asyncApiClient.create();
        const res = await apiClient.get<AuthCurrentUserModel>('/current_user/');
        const dto = AuthCurrentUserMapper.toDto(res.data);

        return dto;
    },
    login: async (domain: AuthLogin): Promise<AuthTokenDto> => {
        const apiClient = await asyncApiClient.create();
        const model = await AuthLoginMapper.toPersistence(domain);
        const res = await apiClient.post<AuthTokenModel>('/auth/', model);
        const dto = AuthTokenMapper.toDto(res.data);

        return dto;
    },
};
