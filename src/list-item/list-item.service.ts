import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ListItem } from './entities/list-item.entity';

import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { List } from 'src/lists/entities/list.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';



@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>
  ) { }


  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput
    //especificamos las relaciones
    const newListItem = this.listItemsRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId }
    });
    return this.listItemsRepository.save(newListItem)
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    const queryBuilder = this.listItemsRepository.createQueryBuilder('listItem')
      .innerJoin('listItem.item', 'item')
      .take(offset)
      .skip(limit)
      .where('"listId=:listId"', { listId: list.id })
    // .where('"userId=:userId"', { userId: user.id })
    if (search) {
      queryBuilder.andWhere('Lower(item.name) LIKE :name', { name: `%${search.toLocaleLowerCase()}%` })
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ListItem> {

    const listitem = await this.listItemsRepository.findOneBy({ id })

    if (listitem) throw new NotFoundException(`lista no encontrada ${id}`)

    return listitem
  }

  async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {

    const { listId, itemId, ...rest } = updateListItemInput;
    const listitem = await this.listItemsRepository.preload({
      ...rest,
      list: { id: listId }
      , item: { id: itemId }
    })

    if (listitem) throw new NotFoundException(`lista no encontrada`);

    return this.listItemsRepository.save(listitem)

  }

  async countListItemByList(list: List): Promise<number> {
    return this.listItemsRepository.count({
      where: {
        list: {
          id: list.id
        }
      }
    })
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
