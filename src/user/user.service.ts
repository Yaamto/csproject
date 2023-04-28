import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async signup(email: string, password: string, username: string, file : Express.Multer.File) {
      // See if email is in use
      const user = await this.repository.findOneBy({email});
      if(user){
          throw new BadRequestException('Email in use');
      }
      // Hash the users password
      // Generate a salt
      const salt = randomBytes(8).toString('hex');
      // Hash the salt and the password together
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      // Join the hashed password and the salt together
      const result = salt + '.' + hash.toString('hex');
      // Create a new user and save it to the database
      const userResult = await this.create(email, result, username, file)
      
      // Return the user
      return userResult
  }

  async signin(email: string, password: string) {
      const user = await this.findByEmail(email);
      if(!user){
          throw new NotFoundException('User not found');
      }
      const [salt, storedHash] = user.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      if(storedHash !== hash.toString('hex')){
          throw new BadRequestException('Bad password');
      }
      return user 
  }
  async create(email: string, password: string, username: string, file: Express.Multer.File){
    const user = await this.repository.create({email, password, username});
    user.profileImage = file.filename
    return this.repository.save(user);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: string){
    return this.repository.createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.id = :id', {id})
    .getOne();
}
findByEmail(email: string){

return this.repository.createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email', {email})
    .getOne();

}

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

 
}
