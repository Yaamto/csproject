import { IsEmail, IsString, IsNotEmpty } from "class-validator";


export class CreateUserDto{
    @IsEmail()
    email: string;
    
    @IsString()
    password: string;

}
