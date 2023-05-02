import { Controller, Get, Post, Body, Patch, Param, Delete, Session, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto'
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { Admin } from 'typeorm';
import { AdminGuard } from 'src/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { join } from 'path';
import {  Request, Response } from 'express';

const storage = diskStorage({
  destination: join(__dirname, '..', '..', 'uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  },
});


@Controller('user')
@Serialize(UserDto)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoami(@CurrentUser() user: User){
    return user
  }

  @Post('/signup', )
  @UseInterceptors(FileInterceptor('image', { storage }))
  async signup(@Body() body: CreateUserDto, @Session() session: any, @UploadedFile() file: Express.Multer.File,) {
    const user = await this.userService.signup(body.email, body.password, body.username, file);
    session.userId = user.id;
    return user
  }

  @Post('/signin')
  async signin(@Body() body: Partial<CreateUserDto>, @Session() session: any) {
    const user = await this.userService.signin(body.email, body.password);
    session.userId = user.id;
    return user
  }


  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard || AdminGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard || AdminGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('/logout')
  logout(@Session() session: any, @Req() req: Request) {
    session.userId = null;
    req.session = null
    return "test"
  }
}
