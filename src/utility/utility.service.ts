import { Injectable } from '@nestjs/common';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Utility } from './entities/utility.entity';
import { Equal, Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Space } from 'src/space/entities/space.entity';
import { User } from 'src/user/entities/user.entity';
import * as fs from 'fs'

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
    if (spaceFetch.users.find((u: User) => u.id !== user.id) && spaceFetch.creator.id !== user.id){
      throw new BadRequestException('User not in space')
    }
    const newUtility = this.utilityRepository.create(utilityData)
    newUtility.category = categoryFetch
    newUtility.space = spaceFetch
    newUtility.path = file.filename
    return await this.utilityRepository.save(newUtility);
  }

  async findAll(id: string, user: User) {
    const utilities = await this.utilityRepository.find({where: {space: Equal(id)}, relations: ['category', 'space']})
    const space = await this.spaceRepository.findOne({where: {id: id}, relations: ['users', 'creator']})

    
      if(space.users.find((u: User) => u.id !== user.id) && space.creator.id !== user.id){
        throw new BadRequestException('User not in space')
      }
    
    if(!utilities) {
      throw new NotFoundException('No utilities found')
    }

    return utilities;
  }

  findOne(id: string) {
    const utility = this.utilityRepository.findOne( {relations: ['category', 'space'], where : {id}})
    if(!utility) {
      throw new NotFoundException('Utility not found')
    }
    return `This action returns a #${id} utility`;
  }

  async update(id: string, utility: UpdateUtilityDto, file: Express.Multer.File, user: User) {
    const { category, ...utilityData } = utility;
    // fetch all we need
    const categoryFetch = await this.isExist(category, 'Category', this.categoryRepository)
    const utilityFetch = await this.isExist(id, 'Utility', this.utilityRepository, ['category', 'space'])
    const spaceFetch = await this.isExist(utilityFetch.space.id, 'Space', this.spaceRepository, ['creator', 'users'])

    //Checking if user is in space
    if(spaceFetch.users.find((u: User) => u.id !== user.id) && spaceFetch.creator.id !== user.id){
      throw new BadRequestException('User not in space')
    }
    
    utilityFetch.category = categoryFetch
    //checking if file is uploaded
    if(file){
      utilityFetch.path = file.filename
    }
    Object.assign(utilityFetch, utilityData)
    return await this.utilityRepository.save(utilityFetch);

  }

  async remove(id: string, user: User) {
    // fetching data and fill variable with if exist 
    const utility = await this.isExist(id, 'Utility', this.utilityRepository, ['space'])
    const spaceFetch = await this.isExist(utility.space.id, 'Space', this.spaceRepository, ['creator', 'users'])
    //Checking if user is in space
    if(spaceFetch.users.find((u: User) => u.id !== user.id) && spaceFetch.creator.id !== user.id){
      throw new BadRequestException('User not in space')
    }
    const imagePath = `uploads/${utility.path}`;
    try {
    // Vérifier si le fichier existe avant de le supprimer
    if (fs.existsSync(imagePath)) {
      // Supprimer le fichier
      fs.unlinkSync(imagePath);
      return await this.utilityRepository.delete(id);
    } else {
      throw new NotFoundException('File not found')
    }
    
  }catch(error){
    throw new BadRequestException('Error while deleting file')
  }
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
