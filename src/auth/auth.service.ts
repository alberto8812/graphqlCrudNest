import { Injectable } from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { SignUpInput } from './dto/inputs/singnup.input';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService
    ) { }

    async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
        //todo: crear usuario

        const user = await this.usersService.create(signUpInput);

        //TODO: CREAR JWT
        const token = 'abc1234';


        return {
            token: 'asdas',
            users: user
        }

    }
}
