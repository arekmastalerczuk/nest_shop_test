import {
Body, Controller, Delete, Get, Inject, Param, Post, UseGuards, UseInterceptors,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AddProductDto} from './dto/add-product.dto';
import {BasketService} from './basket.service';
import {
AddToBasketResponse, GetBasketStatsResponse, RemoveFromBasketResponse, Role,
} from '../types';
import {PasswordProtectGuard} from '../guards/password-protect.guard';
import {UsePassword} from '../decorators/use-password.decorator';
import {MyTimeoutInterceptor} from '../interceptors/my-timeout.interceptor';
import {MyCacheInterceptor} from '../interceptors/my-cache.interceptor';
import {UseCacheTime} from '../decorators/use-cache-time.decorator';
import {UserObj} from '../decorators/user-obj.decorator';
import {User} from '../user/user.entity';
import {Roles} from '../decorators/roles.decorator';
import {RolesGuard} from '../guards/roles.guard';

@Controller('basket')
export class BasketController {
  constructor(
    @Inject(BasketService) private basketService: BasketService,
  ) {}

  @Get('/admin')
  @UsePassword('admin123pass')
  @UseGuards(PasswordProtectGuard)
  @UseInterceptors(MyTimeoutInterceptor, MyCacheInterceptor)
  @UseCacheTime(60)
  getBasketsForAdmin() {
    return this.basketService.getAllForAdmin();
  }

  @Get('/stats')
  // @UseRole(UserRole.User)
  // @UseGuards(RoleProtectGuard)
  // @UsePassword('stats123pass')
  // @UseGuards(PasswordProtectGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.GUEST)
  @UseInterceptors(MyTimeoutInterceptor, MyCacheInterceptor)
  @UseCacheTime(60)
  getStats(): Promise<GetBasketStatsResponse> {
    return this.basketService.getStats();
  }

  @Get('/:userId')
  listProductsInBasket(
    @Param('userId') userId: string,
  ): Promise<any> {
    return this.basketService.getAllForUser(userId);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  addProductToBasket(
    @Body() item: AddProductDto,
    @UserObj() user: User,
  ): Promise<AddToBasketResponse> {
    return this.basketService.add(item, user);
  }

  @Delete('/all/:userId')
  clearBasket(
    @Param('userId') userId: string,
  ) {
    return this.basketService.clearBasket(userId);
  }

  @Delete('/:itemInBasketId/:userId')
  removeProductFromBasket(
    @Param('itemInBasketId') itemInBasketId: string,
    @Param('userId') userId: string,
  ): Promise<RemoveFromBasketResponse> {
    return this.basketService.remove(itemInBasketId, userId);
  }

  // @Get('/total-price/:userId')
  // getBasketTotalPrice(
  //   @Param('userId') userId: string,
  // ): Promise<GetBasketTotalPriceResponse> {
  //   return this.basketService.getTotalPrice(userId);
  // }
}
