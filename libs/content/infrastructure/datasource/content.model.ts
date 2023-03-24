import { UserModel } from '../../../user/infrastructure/datasource/user.model';

export class ContentModel {
    id?: number;
    title!: string;
    category_id!: number;
    deliverables?: string;
    user_id?: number;
    user?: UserModel;
}
