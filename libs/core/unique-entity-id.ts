import { Identifier } from './identifier';

export class UniqueEntityID extends Identifier<number | null> {
    constructor(id?: number | null) {
        super(id ? id : null);
    }
}
