import { IsOptional, IsString, IsNotEmpty, IsUUID } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class UpdateSpaceUserDto {
    
    @IsUUID('4', { each: true })
    @IsOptional()
    addUsers : string[]

    @IsUUID('4', { each: true })
    @IsOptional()
    removeUsers : string[]
}
