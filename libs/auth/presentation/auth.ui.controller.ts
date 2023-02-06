import { authService } from '../application/auth.service';
import { AuthCurrentUserDto } from '../session/dto/auth.current.user.dto';
import { AuthLoginDto } from '../session/dto/auth.login.dto';
import { AuthTokenDto } from '../session/dto/auth.token.dto';

export const authUiController = {
    currentUser: async (): Promise<AuthCurrentUserDto> => {
        return await authService.currentUser();
    },
    login: async (dto: AuthLoginDto): Promise<AuthTokenDto> => {
        return await authService.login(dto);
    },
};
