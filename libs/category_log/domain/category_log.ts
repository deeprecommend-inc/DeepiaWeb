import { AggregateRoot } from '../../core/aggregate';
import { UniqueEntityID } from '../../core/unique-entity-id';
import { CategoryLogId } from './category_log.id';

export interface ICategoryLog {
    id: number;
    logId?: number;
    logIds?: number[];
    categoryIds?: number[];
}

export class CategoryLog extends AggregateRoot<ICategoryLog> {
    get CategoryLogId(): CategoryLogId {
        return CategoryLogId.create(this._id);
    }

    get logId(): number {
        return this.props.logId;
    }

    get logIds(): number[] {
        return this.props.logIds;
    }

    get categoryIds(): number[] {
        return this.props.categoryIds;
    }

    constructor(props: ICategoryLog, id?: UniqueEntityID) {
        super(props, id);
    }

    static create(props: ICategoryLog, id?: UniqueEntityID): CategoryLog {
        const user = new CategoryLog(
            {
                ...props,
            },
            id,
        );

        return user;
    }
}
