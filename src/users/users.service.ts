import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { SignUpInput } from 'src/auth/dto/inputs/singnup.input';
import { Code, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { ValidRoles } from 'src/auth/enum/valid-rules.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { ItemsService } from 'src/items/items.service';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { skip } from 'node:test';


@Injectable()
export class UsersService {
  private logger = new Logger('UserService')
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly itemService: ItemsService
  ) { }

  async create(signUpInput: SignUpInput): Promise<User> {
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

  async findAll(
    roles: ValidRoles[],
    paginationArg: PaginationArgs,
    search: SearchArgs,
  ): Promise<User[]> {
    if (roles.length === 0) {
      return this.userRepository.find({ relations: { lastUpdateBy: true } })
    }
    const { limit, offset } = paginationArg;
    const query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.lastUpdateBy', 'lastUpdateBy')
      .take(limit)
      .skip(offset)
    if (roles.length > 0) {
      query.andWhere('user.roles && :roles', { roles });
    }

    if (search) {
      query.andWhere('LOWER(NAME) LIKE :name', { name: `%${search}%` });
    }

    return query.getMany();



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

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    user: User
  ): Promise<User> {

    try {
      const user = await this.userRepository.preload({ ...updateUserInput, id })
      user.lastUpdateBy = user;
      return await this.userRepository.save(user)

    } catch (error) {
      this.handleeDbError({
        code: 'error-02',
        detail: `user no update`
      })
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToblock = await this.findOne(id);
    userToblock.isActive = false;
    userToblock.lastUpdateBy = adminUser;
    return await this.userRepository.save(userToblock)
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
