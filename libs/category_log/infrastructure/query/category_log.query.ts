import { LogDto } from '../../../log/session/dto/log.dto';
import { categoryLogRepo } from '../repository/category_log.repository';

export const categoryLogQuery = {
    findAll: async (categoryId: number): Promise<LogDto[]> => {
        return await categoryLogRepo.findAll(categoryId);
    },
};
