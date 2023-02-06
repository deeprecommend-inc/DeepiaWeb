import { LogDto } from '../../log/session/dto/log.dto';
import { CategoryLog } from './category_log';

export type CategoryLogRepo = {
    findAll(categoryId: number): Promise<LogDto[]>;
    addMany(domain: CategoryLog): Promise<void>;
    update(domain: CategoryLog): Promise<void>;
};
