import { categoryCommand } from '../infrastructure/command/category.command';
import { categoryQuery } from '../infrastructure/query/category.query';
import { CategoryDto } from '../session/dto/category.dto';
import { CreateCategoryDto } from '../session/dto/create.category.dto';
import { DragAndDropCategoryDto } from '../session/dto/dragAndDrop.category.dto';
import { UpdateCategoryDto } from '../session/dto/update.category.dto';
import { CategoryMapper } from '../session/mapper/category.mapper';

export const categoryService = {
    findAll: async (): Promise<CategoryDto[]> => {
        return await categoryQuery.findAll();
    },
    findPublic: async (): Promise<CategoryDto[]> => {
        return await categoryQuery.findPublic();
    },
    create: async (dto: CreateCategoryDto): Promise<void> => {
        const domain = CategoryMapper.toDomain(dto);
        return await categoryCommand.create(domain);
    },
    update: async (id: number, dto: UpdateCategoryDto): Promise<void> => {
        const domain = CategoryMapper.toDomain(dto);
        return await categoryCommand.update(id, domain);
    },
    delete: async (id: number): Promise<void> => {
        return await categoryCommand.delete(id);
    },
    dragAndDrop: async (
        dto: DragAndDropCategoryDto,
    ): Promise<CategoryDto[]> => {
        const domain = CategoryMapper.toDomain(dto);
        return await categoryCommand.dragAndDrop(domain);
    },
};
