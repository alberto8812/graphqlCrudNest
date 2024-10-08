import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {

  @Field(() => ID, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  @Column()
  name: string

  // @Field(() => Float, { description: 'Example field (placeholder)' })
  // @Column()
  // quantity:number;

  @Field(() => String, { description: 'Example field (placeholder)', nullable: true })
  @Column({ nullable: true })
  quantityUnits?: string;

  //relation  de usuarios
  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field(() => User)
  user: User

  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  listItem: ListItem



}
