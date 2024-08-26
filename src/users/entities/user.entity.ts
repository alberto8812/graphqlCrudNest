import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @Field(() => ID, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  fullName: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  //@Field(()=>String)s
  @Column()
  password: string;


  @Field(() => [String])
  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  roles: string[];

  @Field(() => Boolean)
  @Column(
    {
      type: 'boolean',
      default: true
    }
  )
  isActive: boolean;

  //TODO: RELACIONES
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true })
  @JoinColumn({ name: 'lastUpdateBy' })// determinamos la ralacion 
  lastUpdateBy?: User;
  // NEW RELATION WITH ITEM
  @OneToMany(() => Item, (item) => item.user)
  @Field(() => [Item])
  items: Item[]
}
