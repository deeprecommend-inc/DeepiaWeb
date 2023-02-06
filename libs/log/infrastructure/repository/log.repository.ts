import { asyncApiClient } from '../../../core/api.client';
import { Log } from '../../domain/log';
import { LogRepo } from '../../domain/log.repository';
import { LogDto } from '../../session/dto/log.dto';
import { LogMapper } from '../../session/mapper/log.mapper';
import { LogModel } from '../datasource/log.model';

export const logRepo: LogRepo = {
    findAll: async (): Promise<LogDto[]> => {
        const apiClient = await asyncApiClient.create();
        const res = await apiClient.get<LogModel[]>('/log/');
        const dto = res.data.map((o) => LogMapper.toDto(o));
        return dto;
    },
    findOne: async (id: number): Promise<LogDto> => {
        const apiClient = await asyncApiClient.create();
        const res = await apiClient.get<LogModel>(`/log/${id}/`);
        const dto = LogMapper.toDto(res.data);
        return dto;
    },
    create: async (domain: Log): Promise<void> => {
        const apiClient = await asyncApiClient.create();
        const model = await LogMapper.toPersistence(domain);
        await apiClient.post<void>('/log/', model);
    },
    update: async (id: number, domain: Log): Promise<void> => {
        const apiClient = await asyncApiClient.create();
        const model = await LogMapper.toPersistence(domain);
        await apiClient.put<void>(`/log/${id}/`, model);
    },
    delete: async (domain: Log): Promise<void> => {
        const apiClient = await asyncApiClient.create();
        const model = await LogMapper.toPersistence(domain);
        await apiClient.post<void>(`/log/delete/`, model);
    },
    dragAndDrop: async (domain: Log): Promise<LogDto[]> => {
        const apiClient = await asyncApiClient.create();
        const model = await LogMapper.toPersistence(domain);
        const res = await apiClient.put<LogDto[]>(`/log/drag_and_drop/`, model);
        const dto = res.data.map((o) => LogMapper.toDto(o));
        return dto;
    }
};
