import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utility } from 'src/utility/entities/utility.entity';
import { Map } from './entities/map.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Map, Utility])],
  controllers: [MapController],
  providers: [MapService]
})
export class MapModule {}
