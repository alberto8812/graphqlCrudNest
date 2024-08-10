import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { SignUpInput } from 'src/auth/dto/inputs/singnup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(signUpInput: SignUpInput): Promise<User> {

    try {
      const newUser = this.userRepository.create(signUpInput)
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.log(error)
      throw new BadRequestException("algo salio mal")
    }

  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    throw new Error(`find no implment`);
  }

  block(id: string): Promise<User> {
    throw new Error(`find no implment`);
  }
}
