import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post, Res, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { ShopService } from './shop.service';
import { AddItemDto } from './dto/add-item.dto';
import {
  AddNewProductToShopResponse,
  DeleteOneProductResponse,
  GetListOfProductsResponse,
  GetOneProductResponse, GetPaginatedListOfProductsResponse, MulterDiskUploadFiles,
  UpdateOneProductResponse,
} from '../types';
import { multerStorage, storageDir } from '../utils/storage';
import {UpdateItemDto} from './dto/update-item.dto';

@Controller('shop')
export class ShopController {
  constructor(@Inject(ShopService) private shopService: ShopService) {}

  @Get('/all/:pageNumber')
  getListOfProducts(
    @Param('pageNumber') pageNumber: string,
  ): Promise<GetPaginatedListOfProductsResponse> {
    return this.shopService.getAll(Number(pageNumber));
  }

  @Get('/find/:searchTerm')
  findProductsByName(
    @Param('searchTerm') searchTerm: string,
  ): Promise<GetListOfProductsResponse> {
    return this.shopService.findByName(searchTerm);
  }

  @Get('/:id')
  getOneProduct(@Param('id') id: string): Promise<GetOneProductResponse> {
    return this.shopService.getOneProduct(id);
  }

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor([
        {
          name: 'photo', maxCount: 1,
        },
      ], {storage: multerStorage(path.join(storageDir(), 'product-photos'))}),
  )
  addProduct(
    @Body() newProduct: AddItemDto,
    @UploadedFiles() files: MulterDiskUploadFiles,
  ): Promise<AddNewProductToShopResponse> {
    return this.shopService.addProduct(newProduct, files);
  }

  @Delete('/:id')
  deleteOneProduct(
    @Param('id') id: string,
  ): Promise<DeleteOneProductResponse> {
    return this.shopService.deleteOne(id);
  }

  @Patch('/:id')
  @UseInterceptors(
      FileFieldsInterceptor([
        {
          name: 'photo', maxCount: 1,
        },
      ], {storage: multerStorage(path.join(storageDir(), 'product-photos'))}),
  )
  updateOneProduct(
    @Param('id') id: string,
    @Body() updatedProduct: UpdateItemDto,
    @UploadedFiles() files: MulterDiskUploadFiles,
  ): Promise<UpdateOneProductResponse> {
    return this.shopService.updateOneProduct(id, updatedProduct, files);
  }

  @Get('/photo/:id')
  getPhoto(
    @Param('id') id: string,
    @Res() res: any,
  ): Promise<any> {
    return this.shopService.getPhoto(id, res);
  }
}
