import { UniqueEntityID } from '../../../core/unique-entity-id';
import { Category } from '../../domain/category';
import { CategoryModel } from '../../infrastructure/datasource/category.model';
import { CategoryDto } from '../dto/category.dto';

export class CategoryMapper {
    static toDomain(dto: any): Category {
        return Category.create(
            {
                id: dto.id,
                name: dto.name,
                image: dto.image,
                index: dto.index,
                public: dto.public,
                sourceId: dto.sourceId,
                targetId: dto.targetId,
            },
            new UniqueEntityID(dto.id),
        );
    }

    static toDto(model: CategoryModel): CategoryDto {
        return {
            id: model.id,
            name: model.name,
            image: model.image,
            index: model.index,
            public: model.public,
            userIcon: model.user_icon,
            userName: model.user_name,
        };
    }

    static async toPersistence(domain: Category): Promise<CategoryModel> {
        const model = new CategoryModel();

        model.name = domain.name;
        model.image = domain.image;
        model.public = domain.public;
        model.source_id = domain.sourceId;
        model.target_id = domain.targetId;

        return model;
    }
}
