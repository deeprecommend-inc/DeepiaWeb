import { AggregateRoot } from '../../core/aggregate';
import { UniqueEntityID } from '../../core/unique-entity-id';
import { CategoryId } from './category.id';

export interface ICategory {
    id: number;
    name: string;
    image: string;
    index: number;
    public: boolean;
    sourceId?: number;
    targetId?: number;
}

export class Category extends AggregateRoot<ICategory> {
    get CategoryId(): CategoryId {
        return CategoryId.create(this._id);
    }

    get name(): string {
        return this.props.name;
    }

    get image(): string {
        return this.props.image;
    }

    get index(): number {
        return this.props.index;
    }

    get public(): boolean {
        return this.props.public;
    }

    get sourceId(): number {
        return this.props.sourceId;
    }

    get targetId(): number {
        return this.props.targetId;
    }

    constructor(props: ICategory, id?: UniqueEntityID) {
        super(props, id);
    }

    static create(props: ICategory, id?: UniqueEntityID): Category {
        const user = new Category(
            {
                ...props,
            },
            id,
        );

        return user;
    }
}
