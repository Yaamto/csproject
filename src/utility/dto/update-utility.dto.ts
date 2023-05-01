import { PartialType } from '@nestjs/mapped-types';
import { CreateUtilityDto } from './create-utility.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUtilityDto  {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsUUID("4")
    @IsOptional()
    category: string;

}
