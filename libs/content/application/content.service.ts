import { contentCommand } from '../infrastructure/command/content.command';
import { contentQuery } from '../infrastructure/query/content.query';
import { UpdateContentDto } from '../session/dto/update.content.dto';
import { ContentMapper } from '../session/mapper/content.mapper';
import { ContentDto } from '../session/dto/content.dto';
import { CreateContentDto } from '../session/dto/create.content.dto';
import { ContentQueryDto } from '../session/dto/content.query.dto';

export const contentService = {
    find: async (dto: ContentQueryDto): Promise<ContentDto[]> => {
        const domain = ContentMapper.toDomain(dto);
        return await contentQuery.find(domain);
    },
    findAll: async (): Promise<ContentDto[]> => {
        return await contentQuery.findAll();
    },
    findByUser: async (): Promise<ContentDto[]> => {
        return await contentQuery.findByUser();
    },
    findOne: async (id: number): Promise<ContentDto> => {
        return await contentQuery.findOne(id);
    },
    create: async (dto: CreateContentDto): Promise<void> => {
        const domain = ContentMapper.toDomain(dto);
        return await contentCommand.create(domain);
    },
    update: async (id: number, dto: UpdateContentDto): Promise<void> => {
        const domain = ContentMapper.toDomain(dto);
        return await contentCommand.update(id, domain);
    },
    delete: async (id: number): Promise<void> => {
        return await contentCommand.delete(id);
    },
};
