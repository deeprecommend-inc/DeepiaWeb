import { CategoryDto } from '../session/dto/category.dto';
import { Category } from './category';

export type CategoryRepo = {
    findAll(): Promise<CategoryDto[]>;
    findPublic(): Promise<CategoryDto[]>;
    create(domain: Category): Promise<void>;
    update(id: number, domain: Category): Promise<void>;
    delete(id: number): Promise<void>;
    dragAndDrop(domain: Category): Promise<CategoryDto[]>;
};
