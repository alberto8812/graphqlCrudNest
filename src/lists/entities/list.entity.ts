import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { IsString, Length, MinLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Entity, Index, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'list' })
@ObjectType()
export class List {
  @Field(() => ID, { description: 'id de listite' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'nombre de la lista de los item' })
  @IsString()
  @MinLength(1)
  name: string


  // relacion , idex('userid-list-index)
  @ManyToOne(() => User, (user) => user.lists, { nullable: false })
  @Index('userid-list-index')
  @Field(() => User)
  user: User
}
