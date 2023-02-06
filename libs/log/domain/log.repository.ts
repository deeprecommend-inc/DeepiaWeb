import { LogDto } from '../session/dto/log.dto';
import { Log } from './log';

export type LogRepo = {
    findAll(): Promise<LogDto[]>;
    findOne(id: number): Promise<LogDto>;
    create(domain: Log): Promise<void>;
    update(id: number, domain: Log): Promise<void>;
    delete(domain: Log): Promise<void>;
    dragAndDrop(domain: Log): Promise<LogDto[]>;
};
