import { UniqueEntityID } from '../../../core/unique-entity-id';
import { AuthCurrentUser } from '../../domain/auth.current.user';
import { AuthCurrentUserModel } from '../../infrastructure/datasource/auth.current.user.model';
import { AuthCurrentUserDto } from '../dto/auth.current.user.dto';

export class AuthCurrentUserMapper {
    static toDomain(dto: any): AuthCurrentUser {
        return AuthCurrentUser.create(
            {
                id: dto.id,
                name: dto.name,
                email: dto.email,
            },
            new UniqueEntityID(dto.id),
        );
    }

    static toDto(model: AuthCurrentUserModel): AuthCurrentUserDto {
        return {
            id: model.id,
            name: model.name,
            email: model.email,
            image: model.image,
        };
    }

    static async toPersistence(
        domain: AuthCurrentUser,
    ): Promise<AuthCurrentUserModel> {
        const model = new AuthCurrentUserModel();

        model.id = domain.currentUserId.id.toNumber();
        model.name = domain.name;
        model.email = domain.email;

        return model;
    }
}
