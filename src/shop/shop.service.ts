import {
forwardRef, Inject, Injectable,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { AddItemDto } from './dto/add-item.dto';
import { ShopItem } from './shop-item.entity';
import {
  AddNewProductToShopResponse,
  DeleteOneProductResponse,
  GetListOfProductsResponse, GetOneProductResponse,
  GetPaginatedListOfProductsResponse,
  MulterDiskUploadFiles,
  ShopItemInterface,
  UpdateOneProductResponse,
} from '../types';
import { storageDir } from '../utils/storage';

@Injectable()
export class ShopService {
  constructor(
    @Inject(forwardRef(() => DataSource)) private dataSource: DataSource,
  ) {
  }

  filter(shopItem: ShopItem): ShopItemInterface {
    const {
id, name, description, price,
} = shopItem;
    return {
id, name, description, price,
};
  }

  async addProduct(newProduct: AddItemDto, files: MulterDiskUploadFiles): Promise<AddNewProductToShopResponse> {
    const photo = files?.photo?.[0] ?? null;

    try {
      const { name, description, price } = newProduct;

      const shopItem = new ShopItem();

      shopItem.name = name;
      shopItem.description = description || null;
      shopItem.price = price;

      if (photo) {
        shopItem.photoFn = photo.filename;
      }

      await shopItem.save();

      return this.filter(shopItem);
    } catch (e) {
      try {
        if (photo) {
          fs.unlinkSync(path.join(storageDir(), 'product-photos', photo.filename));
        }
      } catch (e2) {}

      throw e;
     }
  }

  async getAll(currentPage: number = 1): Promise<GetPaginatedListOfProductsResponse> {
    const maxPerPage = 5;

    const [items, count] = await ShopItem.findAndCount({
      skip: maxPerPage * (currentPage - 1),
      take: maxPerPage,
    });

    const pagesCount = Math.ceil(count / maxPerPage);

    console.log({ count, pagesCount });

    return {
      items: items.map(this.filter),
      pagesCount,
    };
  }

  async getOneProduct(id: string): Promise<GetOneProductResponse> {
    // return ShopItem.findOneByOrFail({ id });
    const found = await this.dataSource
      .createQueryBuilder()
      .select('shopItem')
      .from(ShopItem, 'shopItem')
      .where('shopItem.id = :id', {
        id,
      })
      .getOne();

    return this.filter(found);
  }

  async deleteOne(id: string): Promise<DeleteOneProductResponse> {
    const found = await ShopItem.findOneBy({ id });

    if (!found) {
      return {
        isSuccess: false,
        message: `Item with ID ${id} not found.`,
      };
    }

    await found.remove();

    return {
      isSuccess: true,
    };
  }

  async updateOneProduct( // TODO: remove / update photos
    id: string,
    updatedProduct: AddItemDto,
    files: MulterDiskUploadFiles,
  ): Promise<UpdateOneProductResponse> {
    const photo = files?.photo?.[0] ?? null;

    try {
      const { name, description, price } = updatedProduct;
      const foundOld = await ShopItem.findOneBy({id});

      if (photo) {
        if (foundOld.photoFn) {
          fs.unlinkSync(path.join(storageDir(), 'product-photos', foundOld.photoFn));
        }

        await ShopItem.update(id, {
          photoFn: photo.filename,
        });
      }

      if (!photo) {
        fs.unlinkSync(path.join(storageDir(), 'product-photos', foundOld.photoFn));

        await ShopItem.update(id, {
          photoFn: null,
        });
      }

      await ShopItem.update(id, {
        name: updatedProduct.name ? name : foundOld.name,
        description: updatedProduct.description ? description : foundOld.description,
        price: updatedProduct.price ? price : foundOld.price,
      });

      const updated = await ShopItem.findOneBy({ id });

      return {
        item: this.filter(updated),
        photoInfo: photo ? 'Photo was updated successfully' : 'No photo in this item',
      };
    } catch (e) {
      try {
        if (photo) {
          fs.unlinkSync(path.join(storageDir(), 'product-photos', photo.filename));
        }
      } catch (e2) {}

      throw e;
    }
  }

  async findByName(searchTerm: string): Promise<GetListOfProductsResponse> {
    // return ShopItem.find({
    //   where: {
    //     name: Like(`%${searchTerm}%`),
    //   },
    //   order: {
    //     createdAt: 'DESC',
    //   },
    // });

    const foundItems = await this.dataSource
      .createQueryBuilder()
      .select('shopItem')
      .from(ShopItem, 'shopItem')
      .where('shopItem.name LIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('shopItem.createdAt', 'DESC')
      .getMany();

    return foundItems.map(this.filter);
  }

  async getProductPrice(name: string): Promise<number> {
    return (await this.getAll()).items.find((item) => item.name === name).price;
  }

  async hasProduct(name: string): Promise<boolean> {
    return (await this.getAll()).items.some((item) => item.name === name);
  }

  async getPhoto(id: string, res: any): Promise<any> {
    try {
      const one = await ShopItem.findOneBy({id});

      if (!one) {
        throw new Error('No object found!');
      }

      if (!one.photoFn) {
        throw new Error('No photo in this entity');
      }

      res.sendFile(
        one.photoFn,
        {
          root: path.join(storageDir(), 'product-photos'),
        },
      );
    } catch (e) {
      res.json({
        error: e.message,
      });
    }
  }
}
