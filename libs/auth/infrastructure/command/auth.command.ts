import { AuthLogin } from '../../domain/auth.login';
import { AuthTokenDto } from '../../session/dto/auth.token.dto';
import { authRepo } from '../repository/auth.repository';

export const authCommand = {
    login: async (domain: AuthLogin): Promise<AuthTokenDto> => {
        return await authRepo.login(domain);
    },
};
