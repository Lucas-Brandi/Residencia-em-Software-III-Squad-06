import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // remove campos não declarados no DTO
      forbidNonWhitelisted: true, // erro 400 se campo desconhecido for enviado
      transform: true,            // converte tipos automaticamente (ex: string → number)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
