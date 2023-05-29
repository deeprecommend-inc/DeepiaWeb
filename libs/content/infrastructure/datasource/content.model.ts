import { UserModel } from '../../../user/infrastructure/datasource/user.model';

export class ContentModel {
    id?: number;
    prompt!: string;
    category_id!: number;
    deliverables?: string;
    user_id?: number;
    user?: UserModel;
    search_word?: string;
}
