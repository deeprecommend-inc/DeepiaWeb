import { CategoryLog } from '../../domain/category_log';
import { categoryLogRepo } from '../repository/category_log.repository';

export const categoryLogCommand = {
    addMany: async (domain: CategoryLog): Promise<void> => {
        return await categoryLogRepo.addMany(domain);
    },
    update: async (domain: CategoryLog): Promise<void> => {
        return await categoryLogRepo.update(domain);
    },
};
