import { AggregateRoot } from '../../core/aggregate';
import { UniqueEntityID } from '../../core/unique-entity-id';

export interface IAuthToken {
    token: string;
}

export class AuthToken extends AggregateRoot<IAuthToken> {
    get token(): string {
        return this.props.token;
    }

    constructor(props: IAuthToken, id?: UniqueEntityID) {
        super(props, id);
    }

    static create(props: IAuthToken, id?: UniqueEntityID): AuthToken {
        const user = new AuthToken(
            {
                ...props,
            },
            id,
        );

        return user;
    }
}
