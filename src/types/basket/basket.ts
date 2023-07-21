import { ItemInBasket } from '../../basket/item-in-basket.entity';

export type ListProductInBasketResponse = ItemInBasket[];

export type AddToBasketResponse = {
  isSuccess: false
} | {
  isSuccess: true,
  id: string,
}

export type RemoveFromBasketResponse = {
  isSuccess: boolean
}

export type GetBasketTotalPriceResponse = number;

export interface GetBasketStatsResponse {
  itemInBasketAvgPrice: number;
  basketAvgPrice: number;
}
