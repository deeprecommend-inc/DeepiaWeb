import { UniqueEntityID } from '../../../core/unique-entity-id';
import { AuthToken } from '../../domain/auth.token';
import { AuthTokenModel } from '../../infrastructure/datasource/auth.token.model';
import { AuthTokenDto } from '../dto/auth.token.dto';

export class AuthTokenMapper {
    static toDomain(dto: any): AuthToken {
        return AuthToken.create(
            {
                token: dto.token,
            },
            new UniqueEntityID(dto.id),
        );
    }

    static toDto(model: AuthTokenModel): AuthTokenDto {
        return {
            token: model.token,
        };
    }

    static async toPersistence(domain: AuthToken): Promise<AuthTokenModel> {
        const model = new AuthTokenModel();

        model.token = domain.token;

        return model;
    }
}
