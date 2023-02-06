import { UniqueEntityID } from '../../../core/unique-entity-id';
import { CategoryLog } from '../../domain/category_log';
import { CategoryLogModel } from '../../infrastructure/datasource/category_log.model';
import { CategoryLogDto } from '../dto/category_log.dto';

export class CategoryLogMapper {
    static toDomain(dto: any): CategoryLog {
        return CategoryLog.create(
            {
                id: dto.id,
                logId: dto.logId,
                logIds: dto.logIds,
                categoryIds: dto.categoryIds,
            },
            new UniqueEntityID(dto.id),
        );
    }

    static toDto(model: CategoryLogModel): CategoryLogDto {
        return {
            id: model.id,
            logId: model.log_id,
            categoryIds: model.category_ids,
        };
    }

    static toPersistence(domain: CategoryLog): CategoryLogModel {
        const model = new CategoryLogModel();

        model.log_id = domain.logId;
        model.log_ids = domain.logIds;
        model.category_ids = domain.categoryIds;

        return model;
    }
}
