import { contentService } from '../application/content.service';
import { CreateContentDto } from '../session/dto/create.content.dto';
import { ContentDto } from '../session/dto/content.dto';
import { UpdateContentDto } from '../session/dto/update.content.dto';
import { ContentQueryDto } from '../session/dto/content.query.dto';

export const contentUiController = {
    find: async (query: ContentQueryDto): Promise<ContentDto[]> => {
        return await contentService.find(query);
    },
    findAll: async (): Promise<ContentDto[]> => {
        return await contentService.findAll();
    },
    findByUser: async (): Promise<ContentDto[]> => {
        return await contentService.findByUser();
    },
    findOne: async (id: number): Promise<ContentDto> => {
        return await contentService.findOne(id);
    },
    create: async (dto: CreateContentDto): Promise<void> => {
        return await contentService.create(dto);
    },
    update: async (id: number, dto: UpdateContentDto): Promise<void> => {
        return await contentService.update(id, dto);
    },
    delete: async (id: number): Promise<void> => {
        return await contentService.delete(id);
    },
};
