import { AggregateRoot } from '../../core/aggregate';
import { UniqueEntityID } from '../../core/unique-entity-id';
import { CurrentUserId } from './current.user.id';

export interface IAuthCurrentUser {
    id: number;
    name: string;
    email: string;
}

export class AuthCurrentUser extends AggregateRoot<IAuthCurrentUser> {
    get currentUserId(): CurrentUserId {
        return CurrentUserId.create(this._id);
    }

    get name(): string {
        return this.props.name;
    }

    get email(): string {
        return this.props.email;
    }

    constructor(props: IAuthCurrentUser, id?: UniqueEntityID) {
        super(props, id);
    }

    static create(
        props: IAuthCurrentUser,
        id?: UniqueEntityID,
    ): AuthCurrentUser {
        const user = new AuthCurrentUser(
            {
                ...props,
            },
            id,
        );

        return user;
    }
}
