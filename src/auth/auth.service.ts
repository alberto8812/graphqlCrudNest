import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './types/auth-response.type';
import { SignUpInput } from './dto/inputs/singnup.input';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/inputs';
import * as bcrypr from 'bcrypt'
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
        //todo: crear usuario

        const user = await this.usersService.create(signUpInput);

        //TODO: CREAR JWT
        const token = this.jwtService.sign({ id: user.id });//firmamos el nuevo token lo que queremos que cargue grabar lo minimo posible


        return {
            token,
            users: user
        }

    }


    async login(loginInput: LoginInput): Promise<AuthResponse> {
        const user = await this.usersService.findOneByEmail(loginInput.email);
        const token = this.jwtService.sign({ id: user.id });//firmamos el nuevo token lo que queremos que cargue grabar lo minimo posible

        // if (!bcrypr.compareSync(loginInput.password, user.password)) {
        //     throw new BadRequestException('Email/password password do not match')
        // }
        return {
            token,
            users: user
        }

    }
    async validateUser(id: string): Promise<User> {
        const user = await this.usersService.findOne(id);
        if (!user.isActive) {
            throw new UnauthorizedException(` user is inactive , talk wit an admin`);
        }
        delete user.password
        return user;
    }

    revalidateToken(user: User): AuthResponse {
        const token = this.jwtService.sign({ id: user.id });//firmamos el nuevo token lo que queremos que cargue grabar lo minimo posible
        return {
            token,
            users: user
        }
    }
}
