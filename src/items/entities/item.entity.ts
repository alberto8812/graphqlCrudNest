import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'items'})
@ObjectType()
export class Item {
  
  @Field(() => ID, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn('uuid')
  id:string;
  
  @Field(() => String, { description: 'Example field (placeholder)' })
  @Column()
  name: string

  @Field(() => Float, { description: 'Example field (placeholder)' })
  @Column()
  quantity:number;

  @Field(() =>  String, { description: 'Example field (placeholder)',nullable:true })
  @Column({nullable:true})
  quantityUnits?:string;

}
