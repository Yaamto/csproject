import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe  } from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { SpaceDto } from './dto/space.dto'
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UpdateSpaceUserDto } from './dto/update-space-user.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('space')
@Serialize(SpaceDto)
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: CreateSpaceDto, @CurrentUser() user: User) {
    return this.spaceService.create(body, user);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  join(@Param('id') id: string, @CurrentUser() user: User) {
    return this.spaceService.join(id, user);
  }
  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.spaceService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard || AdminGuard)
  findOne(@Param('id') id: string) {
    return this.spaceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() body: UpdateSpaceDto, @CurrentUser() user: User) {
    return this.spaceService.update(id, body, user);
  }

  @Patch('user/:id')
  @UseGuards(AuthGuard)
  updateUsers(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string, @Body() body: UpdateSpaceUserDto, @CurrentUser() user: User) {
    return this.spaceService.updateUsers(id, body, user);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string, @CurrentUser() user: User) {
    return this.spaceService.remove(id, user);
  }
}
