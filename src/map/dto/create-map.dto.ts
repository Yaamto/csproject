import { IsString } from "class-validator";

export class CreateMapDto {

    @IsString()
    name: string;
}
