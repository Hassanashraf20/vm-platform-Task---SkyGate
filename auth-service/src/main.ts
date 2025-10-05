import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
const logger = new Logger('AuthService');
const app = await NestFactory.create(AppModule);
const configService = app.get(ConfigService);
const port = configService.get('PORT') || 3001;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  logger.log(`Auth Service is running on: http://localhost:${port}`);
  await app.listen(port);
}
bootstrap();
