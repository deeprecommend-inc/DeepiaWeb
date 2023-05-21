import { AggregateRoot } from '../../core/aggregate';
import { UniqueEntityID } from '../../core/unique-entity-id';
import { User } from '../../user/domain/user';
import { ContentId } from './content.id';

export interface IContent {
    id: number;
    prompt: string;
    categoryId: number;
    deliverables?: string;
    userId?: number;
    user?: any;
}

export class Content extends AggregateRoot<IContent> {
    get contentId(): ContentId {
        return ContentId.create(this._id);
    }

    get prompt(): string {
        return this.props.prompt;
    }

    get categoryId(): number {
        return this.props.categoryId;
    }

    get deliverables(): string {
        return this.props.deliverables;
    }

    get userId(): number {
        return this.props.userId;
    }

    get user(): User {
        return this.props.user;
    }

    constructor(props: IContent, id?: UniqueEntityID) {
        super(props, id);
    }

    static create(props: IContent, id?: UniqueEntityID): Content {
        const content = new Content(
            {
                ...props,
            },
            id,
        );

        return content;
    }
}
