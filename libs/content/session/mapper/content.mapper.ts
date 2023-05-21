import { UniqueEntityID } from '../../../core/unique-entity-id';
import { Content } from '../../domain/content';
import { ContentModel } from '../../infrastructure/datasource/content.model';
import { ContentDto } from '../dto/content.dto';

export class ContentMapper {
    static toDomain(dto: any): Content {
        return Content.create(
            {
                id: dto.id,
                prompt: dto.prompt,
                categoryId: dto.categoryId,
                deliverables: dto.deliverables,
                userId: dto.userId,
            },
            new UniqueEntityID(dto.id),
        );
    }

    static toDto(model: ContentModel): ContentDto {
        return {
            id: Number(model.id),
            prompt: model.prompt,
            categoryId: model.category_id,
            deliverables: model.deliverables,
            user: {
                id: model.user.id,
                name: model.user.name,
                email: '',
                image: model.user.image,
            },
        };
    }

    static async toPersistence(domain: Content): Promise<ContentModel> {
        const model = new ContentModel();

        model.prompt = domain.prompt;
        model.category_id = domain.categoryId;
        model.deliverables = domain.deliverables;
        model.user_id = domain.userId;

        return model;
    }
}
