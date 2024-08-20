import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { SignUpInput } from './dto/inputs/singnup.input';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/inputs';
import * as bcrypr from 'bcrypt'

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

    async login(loginInput: LoginInput): Promise<AuthResponse> {
        const user = await this.usersService.findOneByEmail(loginInput.email);

        // if (!bcrypr.compareSync(loginInput.password, user.password)) {
        //     throw new BadRequestException('Email/password password do not match')
        // }
        return {
            token: 'asdas',
            users: user
        }

    }
}
