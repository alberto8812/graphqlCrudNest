import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule],
  imports: [
    ConfigModule, //ller las varaibles de entorno
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      // cargar las varaibles de entorno de manera asuncrona
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), //configuracion
        signOptions: {
          expiresIn: '4h', //expirnacion del token
        },
      }),
    }),
    UsersModule,
  ],
})
export class AuthModule { }
