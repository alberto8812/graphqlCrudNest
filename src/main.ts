import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,//sireve para evitar que se envie enviar inromacion de lo que requiero
      //gql se encarga de hacer esa valdacion
    }))
  await app.listen(3001);
}
bootstrap();
