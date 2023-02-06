import { LogDto } from '../../session/dto/log.dto';
import { logRepo } from '../repository/log.repository';

export const logQuery = {
    findAll: async (): Promise<LogDto[]> => {
        return await logRepo.findAll();
    },
    findOne: async (id: number): Promise<LogDto> => {
        return await logRepo.findOne(id);
    },
};
