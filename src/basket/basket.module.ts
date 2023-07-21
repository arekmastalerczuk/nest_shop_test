import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { ShopModule } from '../shop/shop.module';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import {AuthModule} from '../auth/auth.module';

@Module({
  imports: [
    ShopModule,
    UserModule,
    MailModule,
    AuthModule,
  ],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}
