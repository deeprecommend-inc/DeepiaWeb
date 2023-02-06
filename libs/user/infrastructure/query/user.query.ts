import { User } from '../../domain/user';
import { UserDto } from '../../session/dto/user.dto';
import { userRepo } from '../repository/user.repository';

export const userQuery = {
    findAll: async (): Promise<UserDto[]> => {
        return await userRepo.findAll();
    },
    findOne: async (id: number): Promise<UserDto> => {
        return await userRepo.findOne(id);
    },
    isUniqueEmail: async (domain: User): Promise<boolean> => {
        return await userRepo.isUniqueEmail(domain);
    }
}