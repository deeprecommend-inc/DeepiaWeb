import { CategoryDto } from '../../session/dto/category.dto';
import { categoryRepo } from '../repository/category.repository';

export const categoryQuery = {
    findAll: async (): Promise<CategoryDto[]> => {
        return await categoryRepo.findAll();
    },
    findPublic: async (): Promise<CategoryDto[]> => {
        return await categoryRepo.findPublic();
    },
};
