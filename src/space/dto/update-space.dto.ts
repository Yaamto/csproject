import { PartialType } from '@nestjs/mapped-types';
import { CreateSpaceDto } from './create-space.dto';
import { IsOptional, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class UpdateSpaceDto {

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

}
