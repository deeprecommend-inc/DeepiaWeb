import { asyncApiClient } from '../../../core/api.client';
import { LogModel } from '../../../log/infrastructure/datasource/log.model';
import { LogDto } from '../../../log/session/dto/log.dto';
import { LogMapper } from '../../../log/session/mapper/log.mapper';
import { CategoryLog } from '../../domain/category_log';
import { CategoryLogRepo } from '../../domain/category_log.repository';
import { CategoryLogMapper } from '../../session/mapper/category_log.mapper';

const path = '/category/log/';

export const categoryLogRepo: CategoryLogRepo = {
    findAll: async (categoryId: number): Promise<LogDto[]> => {
        const apiClient = await asyncApiClient.create();
        const res = await apiClient.get<LogModel[]>(`${path}${categoryId}/`);
        const dto = res.data.map((o) => LogMapper.toDto(o));
        return dto;
    },
    addMany: async (domain: CategoryLog): Promise<void> => {
        const apiClient = await asyncApiClient.create();
        const model = await CategoryLogMapper.toPersistence(domain);
        await apiClient.post<void>(path, model);
    },
    update: async (domain: CategoryLog): Promise<void> => {
        const apiClient = await asyncApiClient.create();
        const model = await CategoryLogMapper.toPersistence(domain);
        await apiClient.put<void>(path, model);
    },
};
