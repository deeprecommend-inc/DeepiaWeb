import { authCommand } from '../infrastructure/command/auth.command';
import { authQuery } from '../infrastructure/query/auth.query';
import { AuthCurrentUserDto } from '../session/dto/auth.current.user.dto';
import { AuthLoginDto } from '../session/dto/auth.login.dto';
import { AuthTokenDto } from '../session/dto/auth.token.dto';
import { AuthLoginMapper } from '../session/mapper/auth.login.mapper';

export const authService = {
    currentUser: async (): Promise<AuthCurrentUserDto> => {
        return await authQuery.currentUser();
    },
    login: async (dto: AuthLoginDto): Promise<AuthTokenDto> => {
        const domain = AuthLoginMapper.toDomain(dto);
        return await authCommand.login(domain);
    },
};
