import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { SignUpInput } from 'src/auth/dto/inputs/singnup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'


@Injectable()
export class UsersService {
  private logger = new Logger('UserService')
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(signUpInput: SignUpInput): Promise<User> {
    console.log(
      {
        password: bcrypt.hashSync(signUpInput.password, 10),
        ...signUpInput
      }
    )
    try {
      const newUser = this.userRepository.create({
        password: bcrypt.hashSync(signUpInput.password, 10),
        ...signUpInput
      })
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleeDbError(error)
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

  private handleeDbError(error: any): never {

    if (error.code == 23505) {
      throw new BadRequestException(error.detail.replace('key', ''))

    }
    this.logger.error(error)
    throw new InternalServerErrorException('Please check logs')

  }
}
