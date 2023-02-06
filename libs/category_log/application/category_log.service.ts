import { LogDto } from '../../log/session/dto/log.dto';
import { categoryLogCommand } from '../infrastructure/command/category_log.command';
import { categoryLogQuery } from '../infrastructure/query/category_log.query';
import { CategoryLogDto } from '../session/dto/category_log.dto';
import { CategoryLogManyDto } from '../session/dto/category_log.many.dto';
import { CategoryLogMapper } from '../session/mapper/category_log.mapper';

export const categoryLogService = {
    findAll: async (categoryId: number): Promise<LogDto[]> => {
        return await categoryLogQuery.findAll(categoryId);
    },
    addMany: async (dto: CategoryLogManyDto): Promise<void> => {
        const domain = CategoryLogMapper.toDomain(dto);
        return await categoryLogCommand.addMany(domain);
    },
    update: async (dto: CategoryLogDto): Promise<void> => {
        const domain = CategoryLogMapper.toDomain(dto);
        return await categoryLogCommand.update(domain);
    },
};
