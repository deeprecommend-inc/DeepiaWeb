import { logCommand } from '../infrastructure/command/log.command';
import { logQuery } from '../infrastructure/query/log.query';
import { UpdateLogDto } from '../session/dto/update.log.dto';
import { LogMapper } from '../session/mapper/log.mapper';
import { LogDto } from '../session/dto/log.dto';
import { CreateLogDto } from '../session/dto/create.log.dto';
import { DeleteLogDto } from '../session/dto/delete.log.dto';
import { DragAndDropLogDto } from '../session/dto/dragAndDrop.log.dto';

export const logService = {
    findAll: async (): Promise<LogDto[]> => {
        return await logQuery.findAll();
    },
    findOne: async (id: number): Promise<LogDto> => {
        return await logQuery.findOne(id);
    },
    create: async (dto: CreateLogDto): Promise<void> => {
        const domain = LogMapper.toDomain(dto);
        return await logCommand.create(domain);
    },
    update: async (id: number, dto: UpdateLogDto): Promise<void> => {
        const domain = LogMapper.toDomain(dto);
        return await logCommand.update(id, domain);
    },
    delete: async (dto: DeleteLogDto): Promise<void> => {
        const domain = LogMapper.toDomain(dto);
        return await logCommand.delete(domain);
    },
    dragAndDrop: async (dto: DragAndDropLogDto): Promise<LogDto[]> => {
        const domain = LogMapper.toDomain(dto);
        return await logCommand.dragAndDrop(domain);
    }
};
