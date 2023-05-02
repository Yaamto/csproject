import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {

  constructor(@InjectRepository(Category) private repository: Repository<Category>){}

  async create(name: string) {
    const category = await this.repository.findOne({where : {name}})
    if(category) {
      throw new BadRequestException('Category already exist')
    }
    const newCategory = this.repository.create({name})
    return this.repository.save(newCategory);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: string) {
    const category = await this.isExist(id, 'Category')
    return category;
  }

  async update(id: string, attrs: Partial<Category>) {
    const category = await this.isExist(id, 'Category')
    Object.assign(category, attrs)
    return this.repository.save(category)
  }

  async remove(id: string) {
    const category = await this.isExist(id, 'Category')
    return this.repository.remove(category)
  }

  async isExist(id: string, entity: string) {
    const element = await this.repository.findOne({where : {id}})
    if(!element) {
      throw new BadRequestException(`${entity} not found`)
    }
    return element
  }
}
