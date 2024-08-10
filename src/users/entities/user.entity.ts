import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'users'})
@ObjectType()
export class User {
  @Field(() => Int, { description: 'Example field (placeholder)' })
 @PrimaryGeneratedColumn('uuid')
  id:string;

 @Field(()=>String)
 @Column()
 fullName:string;
 
 @Field(()=>String)
 @Column({unique:true})
 email:string;
 
 //@Field(()=>String)
 @Column()
 password:string;
 
 
 @Field(()=>[String])
 @Column({
  type:'text',
  array:true,
  default:['user']
 })
 roles:string[];
 
 @Field(()=>Boolean)
 @Column(
  {
    type:'boolean',
    default:true
  }
 )
 isActive:boolean;
}
