import { UserDto } from '../../../user/session/dto/user.dto';

export class ContentDto {
    id!: number;
    prompt!: string;
    categoryId!: number;
    deliverables!: string;
    user!: UserDto;
}
