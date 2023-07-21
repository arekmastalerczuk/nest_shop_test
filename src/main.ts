import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {NestExpressApplication} from '@nestjs/platform-express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  (app as NestExpressApplication).use(helmet());
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: false, // @TODO: change if PROD
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.use(cookieParser());

  await app.listen(parseInt(process.env.APP_PORT, 10), () => {
    console.log(`Listening on port http://localhost:${process.env.APP_PORT}`);
  });
}
bootstrap();
