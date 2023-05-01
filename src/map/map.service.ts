import { Injectable } from '@nestjs/common';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Map } from './entities/map.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class MapService {

  constructor(@InjectRepository(Map) private mapRepository: Repository<Map>) {}

  async create(map: CreateMapDto) {
    const mapFetch = await this.mapRepository.findOne({where : {name: map.name}})
    if(mapFetch) {
      throw new BadRequestException('Map already exist')
    }
    const newMap = this.mapRepository.create(map)
    return this.mapRepository.save(newMap);
  }

  findAll() {
    return this.mapRepository.find();
  }

  findOne(id: string) {
    const map = this.mapRepository.findOne({where: {id: id}})
    if(!map) {
      throw new BadRequestException('Map not found')
    }
    return map;
  }

  async update(id: string, map: UpdateMapDto) {
    const mapFetch = await this.mapRepository.findOne({where: {id: id}})
    if(!mapFetch) {
      throw new BadRequestException('Map not found')
    }    
    Object.assign(mapFetch, map)
    return await this.mapRepository.save(mapFetch);
  }

  async remove(id: string) {
    const map = await this.mapRepository.findOne({where: {id: id}})
    if(!map) {
      throw new BadRequestException('Map not found')
    } 
    return await this.mapRepository.remove(map);
  }
}
