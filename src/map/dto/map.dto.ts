import { Expose } from "class-transformer";


export class CreateMapDto {

    @Expose()
    name: string;
}