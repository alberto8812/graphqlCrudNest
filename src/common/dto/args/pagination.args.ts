import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsOptional, Min } from "class-validator";



@ArgsType()// para que sea realmente un tipo de argumento
/**
 * 
 */
export class PaginationArgs {
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @Min(0)
    offset: number = 0;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @Min(1)
    limit: number = 10;
}