import { userService } from '../application/user.service';
import { CreateUserDto } from '../session/dto/create.user.dto';
import { IsUniqueEmailDto } from '../session/dto/is.unique.email.dto';
import { UpdateUserDto } from '../session/dto/update.user.dto';
import { UserDto } from '../session/dto/user.dto';

export const userUiController = {
    findAll: async (): Promise<UserDto[]> => {
        return await userService.findAll();
    },
    findOne: async (id: number): Promise<UserDto> => {
        return await userService.findOne(id);
    },
    isUniqueEmail: async (dto: IsUniqueEmailDto): Promise<boolean> => {
        return await userService.isUniqueEmail(dto);
    },
    create: async (dto: CreateUserDto): Promise<void> => {
        return await userService.create(dto);
    },
    update: async (id: number, dto: UpdateUserDto): Promise<void> => {
        return await userService.update(id, dto);
    },
    delete: async (id: number): Promise<void> => {
        return await userService.delete(id);
    },
}