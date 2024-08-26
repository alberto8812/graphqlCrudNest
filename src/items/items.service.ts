import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';


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

  async findAll(user: User): Promise<Item[]> {
    return this.itemRepository.find({
      where: {
        user: {
          id: user.id
        }
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
}
