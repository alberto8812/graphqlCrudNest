import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('listItems')
@ObjectType()
export class ListItem {


  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  @Column({ type: 'numeric' })
  @Field(() => Number)
  quenatity: number

  @Column({ type: 'boolean' })
  @Field(() => Boolean)
  complete: boolean


  @ManyToOne(() => List, (list) => list.listItem, { lazy: true })
  list: List


  @ManyToOne(() => Item, (item) => item.listItem, { lazy: true })
  @Field(() => [ListItem])
  item: Item

}
