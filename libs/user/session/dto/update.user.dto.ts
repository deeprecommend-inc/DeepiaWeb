export class UpdateUserDto {
    name!: string;
    username?: string;
    bio?: string;
    email!: string;
    image?: string;
    following?: string;
    followers?: string;
}
