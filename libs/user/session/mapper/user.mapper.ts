import { UniqueEntityID } from '../../../core/unique-entity-id';
import { User } from '../../domain/user';
import { UserModel } from '../../infrastructure/datasource/user.model';
import { UserDto } from '../dto/user.dto';

export class UserMapper {
    static toDomain(dto: any): User {
        return User.create(
            {
                id: dto.id,
                name: dto.name,
                email: dto.email,
                image: dto.image,
                password: dto.password,
                passwordConfirmation: dto.passwordConfirmation,
            },
            new UniqueEntityID(dto.id),
        );
    }

    static toDto(model: UserModel): UserDto {
        return {
            id: Number(model.id),
            name: model.name,
            email: model.email,
            image: model.image,
        };
    }

    static async toPersistence(domain: User): Promise<UserModel> {
        const model = new UserModel();

        model.name = domain.name;
        model.email = domain.email;
        model.image = domain.image;
        model.password = domain.password;

        return model;
    }
}
