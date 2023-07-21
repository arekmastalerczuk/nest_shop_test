import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import {APP_GUARD} from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopModule } from './shop/shop.module';
import { BasketModule } from './basket/basket.module';
import { UserModule } from './user/user.module';
import { CacheModule } from './cache/cache.module';
import { DiscountCodeModule } from './discount-code/discount-code.module';
import { CronModule } from './cron/cron.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(
      new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        entities: ['./dist/**/**.entity{.ts,.js}'],
        bigNumberStrings: false,
        logging: true,
        synchronize: true,
        autoLoadEntities: true,
      } as DataSourceOptions).options,
    ),
    ShopModule,
    BasketModule,
    UserModule,
    CacheModule,
    DiscountCodeModule,
    CronModule,
    MailModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
      AppService,
      // {
      //     provide: APP_GUARD,
      //     useClass: RolesGuard,
      // },
  ],
})
export class AppModule {}
