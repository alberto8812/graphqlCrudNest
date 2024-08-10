import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository:Repository<Item>
  ){}
  async create(createItemInput: CreateItemInput):Promise<Item> {
    const newItem=this.itemRepository.create(createItemInput);
    return await this.itemRepository.save(newItem);


  }

  async findAll():Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(id: string):Promise<Item> {
    const item= await this. itemRepository.findOneBy({id:id});
    if(!item) throw new NotFoundException(`Item with id ${id} not found`)
    return item
  }

  async update(id: string, updateItemInput: UpdateItemInput):Promise<Item> {
    await this.findOne(id);
    const item =  await this.itemRepository.preload(updateItemInput);// hace una precarga de los datos y si no vienen los campos no aptualiza
    return this.itemRepository.save(item)
  }

  async remove(id: string):Promise<Item> {
     const item=await this.findOne(id);
      await this.itemRepository.delete(id)
    return {...item,id};
  }
}
