import { IsArray } from 'class-validator'
import { ValidRoles } from '../../../auth/enum/valid-rules.enum'
import { ArgsType, Field } from '@nestjs/graphql'


@ArgsType()//define el tipo personalizado de argmento
export class ValidRolesArgs {
    @Field(() => [ValidRoles], { nullable: true })//define como va a licir este campo
    @IsArray()//definimos que es un tipo de arreglo
    roles: ValidRoles[] = []
}