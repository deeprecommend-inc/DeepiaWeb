import { UserDto } from '../../../user/session/dto/user.dto';

export class ContentDto {
    id!: number;
    title!: string;
    categoryId!: number;
    deliverables!: string;
    user!: UserDto;
}
