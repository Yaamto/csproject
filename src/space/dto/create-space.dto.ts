import { IsString } from "class-validator";

export class CreateSpaceDto {

    @IsString()
    name: string;

    @IsString()
    description: string;

}
