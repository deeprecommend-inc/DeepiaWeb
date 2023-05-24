import { Content } from '../../domain/content';
import { contentRepo } from '../repository/content.repository';

export const contentCommand = {
    create: async (domain: Content): Promise<void> => {
        return await contentRepo.create(domain);
    },
    update: async (id: number, domain: Content): Promise<void> => {
        return await contentRepo.update(id, domain);
    },
    delete: async (id: number): Promise<void> => {
        return await contentRepo.delete(id);
    },
};
