import { Injectable } from '@nestjs/common';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Utility } from './entities/utility.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Space } from 'src/space/entities/space.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UtilityService {
  constructor(
   @InjectRepository(Utility) private utilityRepository: Repository<Utility>,
   @InjectRepository(Category) private categoryRepository: Repository<Category>,
   @InjectRepository(Space) private spaceRepository: Repository<Space>,
   ){}

  async create(utility: CreateUtilityDto, file: Express.Multer.File, user: User) {
    const { category, space, ...utilityData } = utility;

    const categoryFetch = await this.isExist(category, 'Category', this.categoryRepository)
    const spaceFetch = await this.isExist(space, 'Space', this.spaceRepository, ['creator', 'users'])
    //Checking if user is in space
    if (!spaceFetch.users.includes(user) && spaceFetch.creator.id !== user.id){
      throw new BadRequestException('User not in space')
    }
    const newUtility = this.utilityRepository.create(utilityData)
    newUtility.category = categoryFetch
    newUtility.space = spaceFetch
    newUtility.path = file.filename
    return await this.utilityRepository.save(newUtility);
  }

  findAll() {
    return `This action returns all utility`;
  }

  findOne(id: number) {
    return `This action returns a #${id} utility`;
  }

  update(id: number, updateUtilityDto: UpdateUtilityDto) {
    return `This action updates a #${id} utility`;
  }

  remove(id: number) {
    return `This action removes a #${id} utility`;
  }

  async isExist(id: string, entity: string, repository: Repository<any>, relations?: string[]) {
    const element = await repository.findOne({ relations: relations, where : {id: id}})
    if(!element) {
      throw new NotFoundException(`${entity} not found`)
    }
    return element
  }

  // async isExistWithRelations(id: string, entity: string, repository: Repository<any>, relations: string[]) {

  //   const element = await repository.findOne({ relations: relations, where : {id: id}})
  //   if(!element) {
  //     throw new NotFoundException(`${entity} not found`)
  //   }
  //   return element
  // }
}
