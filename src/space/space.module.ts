import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './entities/space.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Utility } from 'src/utility/entities/utility.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Space, User, Utility])],
  controllers: [SpaceController],
  providers: [SpaceService, UserService]
})
export class SpaceModule {}
