import { AggregateRoot } from '../../core/aggregate';
import { UniqueEntityID } from '../../core/unique-entity-id';

export interface IAuthLogin {
    email: string;
    password: string;
}

export class AuthLogin extends AggregateRoot<IAuthLogin> {
    get email(): string {
        return this.props.email;
    }

    get password(): string {
        return this.props.password;
    }

    constructor(props: IAuthLogin, id?: UniqueEntityID) {
        super(props, id);
    }

    static create(props: IAuthLogin, id?: UniqueEntityID): AuthLogin {
        const user = new AuthLogin(
            {
                ...props,
            },
            id,
        );

        return user;
    }
}
