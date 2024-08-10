import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/inputs/singnup.input';
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
  // @Mutation(/***/, { name: 'login' })
  // async login(): Promise<> {

  //   // return this.authService.login(/*dR */)
  // }

  // @Query(, { name: 'revalite' })
  // revalidateToken() {
  //   // return this.authService.revalidateToken()
  // }
}
