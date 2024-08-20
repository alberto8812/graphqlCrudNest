import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => AuthResponse, { name: 'signUp' })
  async signUp(
    @Args('signUpInput') signUpInput: SignUpInput
  ): Promise<AuthResponse> {

    return this.authService.signUp(signUpInput)
  }
  @Mutation(() => AuthResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse> {

    return this.authService.login(loginInput)
  }

  // @Query(, { name: 'revalite' })
  // revalidateToken() {
  //   // return this.authService.revalidateToken()
  // }
}
