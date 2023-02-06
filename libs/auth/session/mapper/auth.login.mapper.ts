import { UniqueEntityID } from '../../../core/unique-entity-id';
import { AuthLogin } from '../../domain/auth.login';
import { AuthLoginModel } from '../../infrastructure/datasource/auth.login.model';
import { AuthLoginDto } from '../dto/auth.login.dto';

export class AuthLoginMapper {
    static toDomain(dto: any): AuthLogin {
        return AuthLogin.create(
            {
                email: dto.email,
                password: dto.password,
            },
            new UniqueEntityID(dto.id),
        );
    }

    static toDto(model: AuthLoginModel): AuthLoginDto {
        return {
            email: model.email,
            password: model.password,
        };
    }

    static async toPersistence(domain: AuthLogin): Promise<AuthLoginModel> {
        const model = new AuthLoginModel();

        model.email = domain.email;
        model.password = domain.password;

        return model;
    }
}
