import {
 IsNumber, IsOptional, IsPositive, IsString,
} from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price: number;
}
