import { asyncApiClient } from '../../../core/api.client';
import { Category } from '../../domain/category';
import { CategoryRepo } from '../../domain/category.repository';
import { CategoryDto } from '../../session/dto/category.dto';
import { CategoryMapper } from '../../session/mapper/category.mapper';
import { CategoryModel } from '../datasource/category.model';

const path = '/category/';

export const categoryRepo: CategoryRepo = {
    findAll: async (): Promise<CategoryDto[]> => {
        const apiClient = await asyncApiClient.create();
        const res = await apiClient.get<CategoryModel[]>(path);
        const dto = res.data.map((o) => CategoryMapper.toDto(o));
        return dto;
    },
    findPublic: async (): Promise<CategoryDto[]> => {
        const apiClient = await asyncApiClient.create();
        const res = await apiClient.get<CategoryModel[]>(`${path}public/`);
        const dto = res.data.map((o) => CategoryMapper.toDto(o));
        return dto;
    },
    create: async (domain: Category): Promise<void> => {
        const apiClient = await asyncApiClient.create();
        const model = await CategoryMapper.toPersistence(domain);
        await apiClient.post<void>(path, model);
    },
    update: async (id: number, domain: Category): Promise<void> => {
        const apiClient = await asyncApiClient.create();
        const model = await CategoryMapper.toPersistence(domain);
        await apiClient.put<void>(`${path}${id}/`, model);
    },
    delete: async (id: number): Promise<void> => {
        const apiClient = await asyncApiClient.create();
        await apiClient.delete<void>(`${path}${id}/`);
    },
    dragAndDrop: async (domain: Category): Promise<CategoryDto[]> => {
        const apiClient = await asyncApiClient.create();
        const model = await CategoryMapper.toPersistence(domain);
        const res = await apiClient.put<CategoryDto[]>(
            `${path}drag_and_drop/`,
            model,
        );
        const dto = res.data.map((o) => CategoryMapper.toDto(o));
        return dto;
    },
};
