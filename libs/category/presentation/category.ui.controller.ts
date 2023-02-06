import { categoryService } from '../application/category.service';
import { CategoryDto } from '../session/dto/category.dto';
import { CreateCategoryDto } from '../session/dto/create.category.dto';
import { DragAndDropCategoryDto } from '../session/dto/dragAndDrop.category.dto';
import { UpdateCategoryDto } from '../session/dto/update.category.dto';

export const categoryUiController = {
    findAll: async (): Promise<CategoryDto[]> => {
        return await categoryService.findAll();
    },
    findPublic: async (): Promise<CategoryDto[]> => {
        return await categoryService.findPublic();
    },
    create: async (dto: CreateCategoryDto): Promise<void> => {
        return await categoryService.create(dto);
    },
    update: async (id: number, dto: UpdateCategoryDto): Promise<void> => {
        return await categoryService.update(id, dto);
    },
    delete: async (id: number): Promise<void> => {
        return await categoryService.delete(id);
    },
    dragAndDrop: async (
        dto: DragAndDropCategoryDto,
    ): Promise<CategoryDto[]> => {
        return await categoryService.dragAndDrop(dto);
    },
};
