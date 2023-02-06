import { Category } from '../../domain/category';
import { CategoryDto } from '../../session/dto/category.dto';
import { categoryRepo } from '../repository/category.repository';

export const categoryCommand = {
    create: async (domain: Category): Promise<void> => {
        return await categoryRepo.create(domain);
    },
    update: async (id: number, domain: Category): Promise<void> => {
        return await categoryRepo.update(id, domain);
    },
    delete: async (id: number): Promise<void> => {
        return await categoryRepo.delete(id);
    },
    dragAndDrop: async (domain: Category): Promise<CategoryDto[]> => {
        return await categoryRepo.dragAndDrop(domain);
    }
};
