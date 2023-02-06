import { AggregateRoot } from '../../core/aggregate';
import { UniqueEntityID } from '../../core/unique-entity-id';
import { LogId } from './log.id';

export interface ILog {
    id: number;
    title: string;
    memo?: string;
    link: string;
    ids?: number[];
    index?: number;
    categories?: number[];
    categoryIds?: number[];
    sourceId?: number;
    targetId?: number;
    categoryId?: number;
}

export class Log extends AggregateRoot<ILog> {
    get logId(): LogId {
        return LogId.create(this._id);
    }

    get ids(): number[] | undefined {
        return this.props.ids;
    }

    get title(): string {
        return this.props.title;
    }

    get memo(): string {
        return this.props.memo;
    }

    get link(): string {
        return this.props.link;
    }

    get categories(): number[] {
        return this.props.categories;
    }

    get categoryIds(): number[] {
        return this.props.categoryIds;
    }

    get sourceId(): number {
        return this.props.sourceId;
    }

    get targetId(): number {
        return this.props.targetId;
    }

    get categoryId(): number {
        return this.props.categoryId;
    }

    constructor(props: ILog, id?: UniqueEntityID) {
        super(props, id);
    }

    static create(props: ILog, id?: UniqueEntityID): Log {
        const user = new Log(
            {
                ...props,
            },
            id,
        );

        return user;
    }
}
