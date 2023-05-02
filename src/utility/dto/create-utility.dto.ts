import { IsString, IsUUID } from "class-validator";

export class CreateUtilityDto {

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsUUID("4")
    category: string;

    @IsUUID("4")
    space: string;

    @IsUUID("4")
    map: string;
}
