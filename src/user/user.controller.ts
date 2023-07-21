import {
  Body, Controller, Get, Inject, Param, Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterUserResponse, VerifyUserResponse } from '../types';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService) private userService: UserService,
  ) {}

  @Post('/register')
  registerUser(
    @Body() newUser: RegisterDto,
  ): Promise<RegisterUserResponse> {
    return this.userService.register(newUser);
  }

  @Get('/verify-email/:id') // TODO: Change to Post method
  verifyEmail(
    @Param('id') id: string,
  ): Promise<VerifyUserResponse> {
    return this.userService.verifyEmail(id);
  }
}
