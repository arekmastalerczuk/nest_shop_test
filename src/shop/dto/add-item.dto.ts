import {
 IsNumber, IsOptional, IsPositive, IsString,
} from 'class-validator';

export class AddItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsNumber()
  @IsPositive()
  price: number;
}
