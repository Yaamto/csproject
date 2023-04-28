import { Controller, Get, Post, Body, Patch, Param, Delete, Session, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto'
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('user')
@Serialize(UserDto)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoami(@CurrentUser() user: User){
    console.log(user)
    return user
  }

  @Post("/signup")
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.userService.signup(body.email, body.password);
    console.log(user)
    session.userId = user.id;
    return user
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.userService.signin(body.email, body.password);
    session.userId = user.id;
    return user
  }


  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
