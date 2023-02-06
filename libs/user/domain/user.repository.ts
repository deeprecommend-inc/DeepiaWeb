import { UserDto } from '../session/dto/user.dto';
import { User } from './user';

export type UserRepo = {
    findAll(): Promise<UserDto[]>;
    findOne(id: number): Promise<UserDto>;
    isUniqueEmail(domain: User): Promise<boolean>;
    create(domain: User): Promise<void>;
    update(id: number, domain: User): Promise<void>;
    delete(id: number): Promise<void>; 
}
