import { AggregateRoot } from "../../core/aggregate";
import { UniqueEntityID } from "../../core/unique-entity-id";
import { ContentId } from "./content.id";

export interface IContent {
  id: number;
  title: string;
  categoryId: number;
  deliverables?: string;
  userId?: number;
}

export class Content extends AggregateRoot<IContent> {
  get contentId(): ContentId {
    return ContentId.create(this._id);
  }

  get title(): string {
    return this.props.title;
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

  constructor(props: IContent, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: IContent, id?: UniqueEntityID): Content {
    const user = new Content(
      {
        ...props,
      },
      id
    );

    return user;
  }
}
