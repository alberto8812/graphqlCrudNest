import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

export class JwtAuthGuard extends AuthGuard('jwt') {

    //! override 
    getRequest(context: ExecutionContext) {// sirve para poder obtner la solicitud
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        return request;
    }

}