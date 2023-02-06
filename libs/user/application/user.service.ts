import { userCommand } from '../infrastructure/command/user.command';
import { userQuery } from '../infrastructure/query/user.query';
import { UpdateUserDto } from '../session/dto/update.user.dto';
import { UserMapper } from '../session/mapper/user.mapper';
import { UserDto } from '../session/dto/user.dto';
import { CreateUserDto } from '../session/dto/create.user.dto';
import { User } from '../domain/user';
import { IsUniqueEmailDto } from '../session/dto/is.unique.email.dto';

export const userService = {
    findAll: async (): Promise<UserDto[]> => {
        return await userQuery.findAll();
    },
    findOne: async (id: number): Promise<UserDto> => {
        return await userQuery.findOne(id);
    },
    isUniqueEmail: async (dto: IsUniqueEmailDto): Promise<boolean> => {
        const domain = UserMapper.toDomain(dto);
        return await userQuery.isUniqueEmail(domain);
    },
    create: async (dto: CreateUserDto): Promise<void> => {
        const domain = UserMapper.toDomain(dto);
        return await userCommand.create(domain);
    },
    update: async (
        id: number,
        dto: UpdateUserDto,
    ): Promise<void> => {
        const domain = UserMapper.toDomain(dto);
        return await userCommand.update(id, domain)
    },
    delete: async (id: number): Promise<void> => {
        return await userCommand.delete(id);
    }
}
