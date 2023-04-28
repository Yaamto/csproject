import  { Expose, Exclude, Transform} from "class-transformer"
import { User } from "src/user/entities/user.entity";

export class SpaceDto {
    
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    @Transform(({ obj }) => obj.creator )
    creator: User;

    @Expose()
    @Transform(({ obj }) => obj.users )
    users: User[];
}