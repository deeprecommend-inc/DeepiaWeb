import { LogDto } from '../../log/session/dto/log.dto';
import { categoryLogService } from '../application/category_log.service';
import { CategoryLogDto } from '../session/dto/category_log.dto';
import { CategoryLogManyDto } from '../session/dto/category_log.many.dto';

export const categoryLogUiController = {
    findAll: async (categoryId: number): Promise<LogDto[]> => {
        return await categoryLogService.findAll(categoryId);
    },
    addMany: async (dto: CategoryLogManyDto): Promise<void> => {
        return await categoryLogService.addMany(dto);
    },
    update: async (dto: CategoryLogDto): Promise<void> => {
        return await categoryLogService.update(dto);
    },
};
