import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { User } from 'src/users/entities/user.entity';
import { List } from './entities/list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRespository: Repository<List>
  ) { }
  async create(
    createListInput: CreateListInput,
    user: User,
  ): Promise<List> {
    const newList = this.listRespository.create({ ...createListInput, user })
    return await this.listRespository.save(newList)

  }

  async findAll(
    user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs
  ): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    const queryBuilder = this.listRespository.createQueryBuilder()
      .take(offset)
      .skip(limit)
      .where('"userId=:userId"', { userId: user.id })
    if (search) {
      queryBuilder.andWhere('Lower(NAME) LIKE :name', { name: `%${search.toLocaleLowerCase()}%` })
    }

    return queryBuilder.getMany();
  }

  async findOne(
    id: string,
    user: User
  ): Promise<List> {
    const items = await this.listRespository.findOneBy({
      id: id,
      user: {
        id: user.id
      }
    })
    return items;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user)
    const list = await this.listRespository.preload(updateListInput);
    if (!list) throw new NotFoundException(`Item with id ${id} not found`)
    return this.listRespository.save(list)
  }

  async remove(id: string, user: User) {
    const list = await this.findOne(id, user);
    await this.listRespository.delete(id)
    return { ...list, id };
  }

  async listCountByUser(user: User): Promise<number> {
    return await this.listRespository.count({
      where: {
        user: {
          id: user.id
        }
      }
    })
  }
}
