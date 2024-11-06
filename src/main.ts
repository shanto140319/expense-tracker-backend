import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Automatically strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw an error for non-whitelisted properties
    }),
  );
  app.enableCors({
    origin: 'https://expense-tracker-backend-1-ud79.onrender.com',
    methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
