import { Content } from '../../domain/content';
import { ContentDto } from '../../session/dto/content.dto';
import { contentRepo } from '../repository/content.repository';

export const contentQuery = {
    find: async (domain: Content): Promise<ContentDto[]> => {
        return await contentRepo.find(domain);
    },
    findAll: async (): Promise<ContentDto[]> => {
        return await contentRepo.findAll();
    },
    findByUser: async (): Promise<ContentDto[]> => {
        return await contentRepo.findByUser();
    },
    findOne: async (id: number): Promise<ContentDto> => {
        return await contentRepo.findOne(id);
    },
};
