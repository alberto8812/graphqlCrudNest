import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: 'nombre del item' })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @Field(() => Float, { description: 'cantidad de productos que puede tener' })
  @IsNumber()
  @IsPositive()
  @Min(0)
  quantity:number;

  @Field(() => String, { description: 'es cantidad de unidades' ,nullable:true})
  @IsOptional()
  @IsString()
  quantityUnits?:string;
}
