import { AuthCurrentUserDto } from '../session/dto/auth.current.user.dto';
import { AuthTokenDto } from '../session/dto/auth.token.dto';
import { AuthLogin } from './auth.login';

export type CurrentUser = () => Promise<AuthCurrentUserDto>;
export type Login = (domain: AuthLogin) => Promise<AuthTokenDto>;

export type AuthRepo = {
    currentUser(): Promise<AuthCurrentUserDto>;
    login(domain: AuthLogin): Promise<AuthTokenDto>;
};
