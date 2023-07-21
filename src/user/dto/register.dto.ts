import { IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  email: string;

  @IsString()
  nickname: string;

  @IsString()
  @MinLength(8)
  pwd: string;
}
