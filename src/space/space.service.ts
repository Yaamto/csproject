import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { In, Repository } from 'typeorm';
import { Space } from './entities/space.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UpdateSpaceUserDto } from './dto/update-space-user.dto';

@Injectable()
export class SpaceService {

  constructor(@InjectRepository(Space)private repository: Repository<Space>,
  @InjectRepository(User) private userRepository : Repository<User>
  ) {}

  async create(space: CreateSpaceDto, user: User) {
    const newSpace = this.repository.create(space)
    newSpace.creator = user
    return await this.repository.save(newSpace);
  }

  async join(id: string, user: User) {
    const space = await this.repository.findOne({relations: ['users'], where : { id: id }})
    //Checking if space exist
    if(!space) {
      throw new NotFoundException('Space not found')
    }
    //Checking if user is already in space
    if(space.users.find(u => u.id === user.id)) {
      throw new BadRequestException('User already in space')
    }
    space.users.push(user)
    return await this.repository.save(space)
  }

  findAll() {
    return this.repository.find({relations: ['users', 'creator']});
  }

  findOne(id: string) {
    return this.repository.findOne({relations: ['users', 'creator'], where : { id: id }});
  }

  
  async update(id: string, attrs: Partial<Space>, user: User) {
      const space = await this.repository.findOne({relations: ['creator'], where : { id: id }})
      //Checking if user is the creator of the space
     this.checkCreator(space, user)
      //Checking if space exist
      if(!space) {
        throw new NotFoundException('Space not found')
      }
      Object.assign(space, attrs)
      return this.repository.save(space)
  }
  async updateUsers(id: string, updateSpaceUserDto: UpdateSpaceUserDto, user: User) {
    const space = await this.repository.findOne( { relations: ['users', 'creator'], where : {id: id} });
    if (!space) {
      throw new NotFoundException('Space not found');
    }
    this.checkCreator(space, user)

    const { addUsers = [], removeUsers = [] } = updateSpaceUserDto;
    //checking if we have users to add
    if (addUsers.length > 0) {
      const usersToAdd = await this.userRepository.find({ where: { id: In(addUsers) } });
      //checking if users are already in space
      usersToAdd.forEach(user => {
        if (!space.users.every(u => u.id !== user.id)) {
          throw new BadRequestException(`User : ${user.username} is already in this space`);
        }
        space.users.push(user);
      });
      return this.repository.save(space);
    }
    //checking if we have users to remove
    if (removeUsers.length > 0) {
      const usersToRemove = await this.userRepository.find({ where: { id: In(removeUsers) } });
      space.users = space.users.filter(user => usersToRemove.every(u => u.id !== user.id));
      return this.repository.save(space);
    }
    throw new BadRequestException("No users to add or remove");
  }
  
  async remove(id: string, user: User) {
    const space = await this.repository.findOne({relations: ['users', 'creator'], where : { id: id }})
    if(!space) {
      throw new NotFoundException('Space not found')
    }
    this.checkCreator(space, user)
    return this.repository.delete(space.id);
  }

  //Checking if user is the creator of the space
  checkCreator(space: Space, user: User) {
    if(space.creator.id !== user.id) {
      throw new BadRequestException('You are not the creator of this space')
    }
  }
}
