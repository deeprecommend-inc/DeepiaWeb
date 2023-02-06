import { AggregateRoot } from '../../core/aggregate';
import { UniqueEntityID } from '../../core/unique-entity-id';
import { UserId } from './user.id';

export interface IUser {
    id: number;
    name: string;
    email: string;
    image?: string;
    password: string;
    passwordConfirmation: string;
}

export class User extends AggregateRoot<IUser> {
    get userId(): UserId {
        return UserId.create(this._id);
    }

    get name(): string {
        return this.props.name;
    }

    get email(): string {
        return this.props.email;
    }

    get image(): string {
        return this.props.image;
    }

    get password(): string {
        return this.props.password;
    }

    get passwordConfirmation(): string {
        return this.props.passwordConfirmation;
    }

    constructor(props: IUser, id?: UniqueEntityID) {
        super(props, id);
    }

    static create(props: IUser, id?: UniqueEntityID): User {
        const user = new User(
            {
                ...props,
            },
            id,
        );

        return user;
    }
}
