import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AddProductDto } from './dto/add-product.dto';
import {
  AddToBasketResponse, GetBasketStatsResponse,
  GetBasketTotalPriceResponse,
  ListProductInBasketResponse,
  RemoveFromBasketResponse,
} from '../types/basket';
import { ShopService } from '../shop/shop.service';
import { ItemInBasket } from './item-in-basket.entity';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { User } from '../user/user.entity';
import {ShopItem} from '../shop/shop-item.entity';

@Injectable()
export class BasketService {
  constructor(
    @Inject(ShopService) private shopService: ShopService,
    @Inject(UserService) private userService: UserService,
    @Inject(DataSource) private dataSource: DataSource,
    @Inject(MailService) private mailService: MailService,
  ) {}

  async add(product: AddProductDto, user: User): Promise<AddToBasketResponse> {
    const { productId, count } = product;

    const shopItem = await ShopItem.findOne({
      where: {
        id: productId,
      },
    });

    if (
      typeof productId !== 'string'
      || typeof count !== 'number'
      || count < 1
      || !shopItem
    ) {
      return {
        isSuccess: false,
      };
    }

   const item = new ItemInBasket();
   item.count = count;
   await item.save();

   item.shopItem = shopItem;
   item.user = user;
   await item.save();

    return {
      isSuccess: true,
      id: item.id,
    };
  }

  async remove(itemInBasketId: string, userId: string): Promise<RemoveFromBasketResponse> {
    const user = await this.userService.getOneUser(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const foundItem = await ItemInBasket.findOne({
      where: {
        id: itemInBasketId,
        user: user.valueOf(),
      },
    });

    if (foundItem) {
    await foundItem.remove();
      return {
        isSuccess: true,
      };
    }

    return {
      isSuccess: false,
    };
  }

  async getAllForUser(userId: string): Promise<ListProductInBasketResponse> {
    const user = await this.userService.getOneUser(userId);

    return ItemInBasket.find({
      relations: ['shopItem'],
      where: { user: user.valueOf() },
    });
  }

  async getAllForAdmin(): Promise<ListProductInBasketResponse> {
    return ItemInBasket.find({
      relations: [
        'shopItem',
        'user',
      ],
    });
  }

  async getTotalPrice(userId: string): Promise<GetBasketTotalPriceResponse> {
    const items = await this.getAllForUser(userId);

    return (await Promise.all(items.map(async (item) => (item.shopItem.price * item.count * 1.23))))
      .reduce((prev, curr) => prev + curr, 0);
  }

  async clearBasket(userId: string) {
    const user = await this.userService.getOneUser(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await ItemInBasket.delete({
      user: user.valueOf(),
    });
  }

  async countPromo(userId: string): Promise<number> {
    return (await this.getTotalPrice(userId)) > 10 ? 1 : 0;
  }

  async getStats(): Promise<GetBasketStatsResponse> {
    const { itemInBasketAvgPrice } = await this.dataSource
      .createQueryBuilder()
      .select('(AVG(shopItem.price))', 'itemInBasketAvgPrice')
      .from(ItemInBasket, 'itemInBasket')
      .leftJoin('itemInBasket.shopItem', 'shopItem')
      .getRawOne();

    const allItemsInBasket = await this.getAllForAdmin();

    const baskets: {
      [userId: string]: number;
    } = {};

    for (const oneItemInBasket of allItemsInBasket) {
      baskets[oneItemInBasket.user.id] = baskets[oneItemInBasket.user.id] || 0;

      baskets[oneItemInBasket.user.id] += oneItemInBasket.shopItem.price * oneItemInBasket.count * 1.23;
    }

    const basketValues = Object.values(baskets);

    const basketAvgPrice = (basketValues.reduce((prev, curr) => prev + curr, 0) / basketValues.length);

    return {
      itemInBasketAvgPrice: Number(itemInBasketAvgPrice),
      basketAvgPrice,
    };
  }
}
