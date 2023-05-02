import  { Expose, Exclude} from "class-transformer"

export class UserDto {
    
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    username: string;

    @Expose()
    profileImage: string;

    @Expose()
    admin: boolean;
}