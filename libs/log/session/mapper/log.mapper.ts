import { UniqueEntityID } from '../../../core/unique-entity-id';
import { Log } from '../../domain/log';
import { LogModel } from '../../infrastructure/datasource/log.model';
import { LogDto } from '../dto/log.dto';

export class LogMapper {
    static toDomain(dto: any): Log {
        return Log.create(
            {
                id: dto.id,
                ids: dto.ids,
                title: dto.title,
                memo: dto.memo,
                link: dto.link,
                categories: dto.categories,
                categoryIds: dto.categoryIds,
                sourceId: dto.sourceId,
                targetId: dto.targetId,
                categoryId: dto.categoryId,
            },
            new UniqueEntityID(dto.id),
        );
    }

    static toDto(model: LogModel): LogDto {
        return {
            id: Number(model.id),
            title: model.title,
            memo: model.memo,
            link: model.link,
            index: model.index,
            categories: model.categories,
            edit: `edit$${model.id}`,
            copy: `copy${model.id}`,
            iFrame: `iFrame${model.id}`,
            category: `category${model.id}`,
        };
    }

    static async toPersistence(domain: Log): Promise<LogModel> {
        const model = new LogModel();

        model.ids = domain.ids;
        model.title = domain.title;
        model.memo = domain.memo;
        model.link = domain.link;
        model.category_ids = domain.categoryIds;
        model.source_id = domain.sourceId;
        model.target_id = domain.targetId;
        model.category_id = domain.categoryId;

        return model;
    }
}
