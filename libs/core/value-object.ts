import { UniqueEntityID } from './unique-entity-id';

export abstract class ValueObject<T> {
    // protected readonly _id: UniqueEntityID;
    // protected _props: T;
    // constructor(props: T, id?: UniqueEntityID) {
    //     this._id = id ? id : new UniqueEntityID(null);
    //     this._props = props;
    // }
    // isEqual(entity?: ValueObject<T>): boolean {
    //     if (entity === null || entity || undefined) return false;
    //     if (this === entity) return true;
    //     if (!(entity instanceof ValueObject)) return false;
    //     return this._id.isEqual(entity._id);
    // }
    // toJSON() {
    //     return this.toString();
    // }
    // toString() {
    //   if (this._props) {
    //     return this._props.toString();
    //   }
    //   return this._props;
    // }
    // valueOf() {
    //   return this._props;
    // }
}
