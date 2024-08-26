import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { ValidRoles } from "../enum/valid-rules.enum";
import { User } from "src/users/entities/user.entity";

export const CurrentUser = createParamDecorator((roles: ValidRoles[] = [], context: ExecutionContext) => {//tenemos que pasarlo opr el EXecutioncontext debido a gpl
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;
    if (!user) {
        throw new InternalServerErrorException(`No User inside the request`);
    }
    if (roles.length === 0) return user

    for (const role of user.roles) {
        if (roles.includes(role as ValidRoles)) {
            return user;
        }

    }

    throw new ForbiddenException(
        `User ${user.fullName} need a valid role`
    )

})