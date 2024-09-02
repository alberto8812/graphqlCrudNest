import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

import { PaginationArgs, SearchArgs } from 'src/common/dto/args';


@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) { }
  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemRepository.create({ ...createItemInput, user });
    return await this.itemRepository.save(newItem);


  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Item[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    return this.itemRepository.find({
      take: limit,//el liminte de registro que quiero traer 
      skip: offset,//el salto de registro
      where: {
        user: {
          id: user.id
        },
        name: Like(`%${search}`)
      }
    });
  }

  async findOne(id: string, user: User,): Promise<Item> {
    const item = await this.itemRepository.findOneBy({
      id: id,
      user: {
        id: user.id
      }
    });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`)
    return item
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User,): Promise<Item> {
    await this.findOne(id, user);
    const item = await this.itemRepository.preload(updateItemInput);// hace una precarga de los datos y si no vienen los campos no aptualiza
    return this.itemRepository.save(item)
  }

  async remove(id: string, user: User,): Promise<Item> {
    const item = await this.findOne(id, user);
    await this.itemRepository.delete(id)
    return { ...item, id };
  }

  async itemCounterByUser(user: User): Promise<number> {
    return this.itemRepository.count({ where: { user: { id: user.id } } })
  }
}




