import { PartialType } from '@nestjs/mapped-types';
import { CreateUtilityDto } from './create-utility.dto';
import { IsString, IsUUID } from 'class-validator';

export class UpdateUtilityDto  {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsUUID("4")
    category: string;

}
