import { Module } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { UtilityController } from './utility.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utility } from './entities/utility.entity';
import { Space } from 'src/space/entities/space.entity';
import { Category } from 'src/category/entities/category.entity';
import { Map } from 'src/map/entities/map.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Utility, Space, Category, Map])],
  controllers: [UtilityController],
  providers: [UtilityService]
})
export class UtilityModule {}
