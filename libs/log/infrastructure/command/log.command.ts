import { Log } from '../../domain/log';
import { LogDto } from '../../session/dto/log.dto';
import { logRepo } from '../repository/log.repository';

export const logCommand = {
    create: async (domain: Log): Promise<void> => {
        return await logRepo.create(domain);
    },
    update: async (id: number, domain: Log): Promise<void> => {
        return await logRepo.update(id, domain);
    },
    delete: async (domain: Log): Promise<void> => {
        return await logRepo.delete(domain);
    },
    dragAndDrop: async (domain: Log): Promise<LogDto[]> => {
        return await logRepo.dragAndDrop(domain);
    }
};
