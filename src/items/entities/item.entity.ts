import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'items'})
@ObjectType()
export class Item {
  
  @Field(() => Int, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column()
  name: string
  @Column()
  quentity:number;
  @Column()
  quentityUnits:string;

}
