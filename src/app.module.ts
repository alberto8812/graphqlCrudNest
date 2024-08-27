import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    //manejo de manera asincrona
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,//habilitamos el drive 
      imports: [AuthModule],
      inject: [JwtService],
      //injectamos el jwt service
      useFactory: async (jwtService: JwtService) => (//trabajo de manera asincrona la carga
        {
          playground: false,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          plugins: [
            ApolloServerPluginLandingPageLocalDefault()
          ],
          //podemos agregar el context
          //trae la informacion propiamente de nuestro esquema
          context({ req }) {
            // //de la request puedo tomar todos lo que requiramos
            // const token = req.headers.authorization?.replace('Bearer ', '')
            // //obtenemos el payload
            // if (!token) throw Error('Token needed');
            // const payload = jwtService.decode(token)
            // if (!payload) throw Error('Token  not valid');

          }
        }
      )
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: false,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   plugins: [
    //     ApolloServerPluginLandingPageLocalDefault()
    //     ]
    // }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true
    }),


    ItemsModule,


    UsersModule,


    AuthModule,


    SeedModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
