export interface ShopItemInterface {
  id: string;
  name: string;
  description: string | null;
  price: number;
}

export type GetListOfProductsResponse = ShopItemInterface[];

export type GetOneProductResponse = ShopItemInterface;

export type DeleteOneProductResponse =
  | {
      isSuccess: false;
      message: string;
    }
  | {
      isSuccess: true;
    };

export type UpdateOneProductResponse = {
    item: ShopItemInterface,
    photoInfo: 'Photo was updated successfully' | 'No photo in this item'
};

export interface GetPaginatedListOfProductsResponse {
  items: ShopItemInterface[];
  pagesCount: number;
}

export interface ShopItemDetailsInterface {
  weight: number;
  color: string;
}

export type AddNewProductToShopResponse = ShopItemInterface;
