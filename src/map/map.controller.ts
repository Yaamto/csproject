import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe} from '@nestjs/common';
import { MapService } from './map.service';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: CreateMapDto) {
    return this.mapService.create(body);
  }

  @Get()
  findAll() {
    return this.mapService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string) {
    return this.mapService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string, @Body() body: UpdateMapDto) {
    return this.mapService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string) {
    return this.mapService.remove(id);
  }
}
