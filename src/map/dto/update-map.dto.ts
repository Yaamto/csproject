import { IsString } from 'class-validator';

export class UpdateMapDto  {
    @IsString()
    name: string;
}
