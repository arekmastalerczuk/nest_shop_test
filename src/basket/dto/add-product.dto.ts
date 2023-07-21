import { IsInt, IsUUID } from 'class-validator';

export class AddProductDto {
  @IsUUID()
  productId: string;

  @IsInt()
  count: number;
}
