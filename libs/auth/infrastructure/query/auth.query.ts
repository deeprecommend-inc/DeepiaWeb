import { AuthCurrentUserDto } from '../../session/dto/auth.current.user.dto';
import { authRepo } from '../repository/auth.repository';

export const authQuery = {
    currentUser: async (): Promise<AuthCurrentUserDto> => {
        return await authRepo.currentUser();
    },
};
