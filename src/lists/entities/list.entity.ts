import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { IsString, Length, MinLength } from 'class-validator';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'list' })
@ObjectType()
export class List {
  @Field(() => ID, { description: 'id de listite' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'nombre de la lista de los item' })
  @IsString()
  @MinLength(1)
  @Column()
  name: string


  // relacion , idex('userid-list-index)
  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index('userid-list-index')
  @Field(() => User)
  user: User

  @OneToMany(() => ListItem, (listItem) => listItem.list, { lazy: true })
  @Field(() => [ListItem])
  listItem: ListItem
}
