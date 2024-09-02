import { Injectable } from '@nestjs/common';
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
  ) {
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
    if (search) {
      queryBuilder.andWhere('Lower(NAME) LIKE :name', { name: `%${search.toLocaleLowerCase()}%` })
    }

    return queryBuilder.getMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} list`;
  }

  update(id: string, updateListInput: UpdateListInput) {
    return `This action updates a #${id} list`;
  }

  remove(id: string) {
    return `This action removes a #${id} list`;
  }
}
