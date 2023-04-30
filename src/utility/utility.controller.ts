import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { diskStorage } from 'multer';
import { join } from 'path';
import { UtilityDto } from './dto/utility.dto';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

const storage = diskStorage({
  destination: join(__dirname, '..', '..', 'uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  },
});

@Controller('utility')
@Serialize(UtilityDto)
export class UtilityController {
  constructor(private readonly utilityService: UtilityService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage }))
  create(@Body() body: CreateUtilityDto, @UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
    return this.utilityService.create(body, file, user);
  }

  @Get('space/:id')
  @UseGuards(AuthGuard)
  findAll(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string, @CurrentUser() user: User) {
    return this.utilityService.findAll(id, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string) {
    return this.utilityService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage }))
  update(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string, @Body() body: UpdateUtilityDto, @UploadedFile() file: Express.Multer.File, @CurrentUser() user: User) {
    return this.utilityService.update(id, body, file, user);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string, @CurrentUser() user: User) {
    return this.utilityService.remove(id, user);
  }
}
