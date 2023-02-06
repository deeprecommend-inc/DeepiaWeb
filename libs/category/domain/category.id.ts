import { Entity } from '../../core/entity';
import { UniqueEntityID } from '../../core/unique-entity-id';

export class CategoryId extends Entity<any> {
    get id(): UniqueEntityID {
        return this._id;
    }

    private constructor(id?: UniqueEntityID) {
        super(null, id);
    }

    static create(id?: UniqueEntityID): CategoryId {
        return new CategoryId(id);
    }
}
