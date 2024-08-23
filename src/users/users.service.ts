import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { SignUpInput } from 'src/auth/dto/inputs/singnup.input';
import { Code, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { ValidRoles } from 'src/auth/enum/valid-rules.enum';


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

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) {
      return this.userRepository.find()
    }
    return this.userRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY [:...roles]') //en la columna  de array que tengo  de roles tiene que estar  en el array de roles
      .setParameter('roles', roles)// que lo vamos a buscar  
      .getMany()

  }

  async findOne(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id })
    } catch (error) {
      this.handleeDbError({
        code: 'error-01',
        detail: `${id} no found`
      })
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email })
    } catch (error) {
      this.handleeDbError({
        code: 'error-01',
        detail: `${email} no found`
      })
    }
  }

  block(id: string): Promise<User> {
    throw new Error(`find no implment`);
  }

  private handleeDbError(error: any): never {

    if (error.code == 23505) {
      throw new BadRequestException(error.detail.replace('key', ''))

    }

    if (error.code == 'error-01') {
      throw new BadRequestException(error.detail.replace('key', ''))

    }
    this.logger.error(error)
    throw new InternalServerErrorException('Please check logs')

  }
}
