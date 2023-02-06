import { userRepo } from '../repository/user.repository';
import { User } from '../../domain/user';

export const userCommand = {
    create:  async (domain: User): Promise<void> => {
        return await userRepo.create(domain);
    },
    update: async (
        id: number,
        domain: User,
    ): Promise<void> => {
        return await userRepo.update(id, domain);
    },
    delete: async (id: number): Promise<void> => {
        return await userRepo.delete(id);
    }
}