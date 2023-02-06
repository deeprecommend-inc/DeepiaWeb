import { logService } from '../application/log.service';
import { CreateLogDto } from '../session/dto/create.log.dto';
import { DeleteLogDto } from '../session/dto/delete.log.dto';
import { DragAndDropLogDto } from '../session/dto/dragAndDrop.log.dto';
import { LogDto } from '../session/dto/log.dto';
import { UpdateLogDto } from '../session/dto/update.log.dto';

export const logUiController = {
    findAll: async (): Promise<LogDto[]> => {
        return await logService.findAll();
    },
    findOne: async (id: number): Promise<LogDto> => {
        return await logService.findOne(id);
    },
    create: async (dto: CreateLogDto): Promise<void> => {
        return await logService.create(dto);
    },
    update: async (id: number, dto: UpdateLogDto): Promise<void> => {
        return await logService.update(id, dto);
    },
    delete: async (dto: DeleteLogDto): Promise<void> => {
        return await logService.delete(dto);
    },
    dragAndDrop: async (dto: DragAndDropLogDto): Promise<LogDto[]> => {
        return await logService.dragAndDrop(dto);
    }
};
