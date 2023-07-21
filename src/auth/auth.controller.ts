import {
  Body, Controller, Get, Post, Res, UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {AuthGuard} from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import {UserObj} from '../decorators/user-obj.decorator';
import {User} from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  userLogin(
    @Body() req: AuthLoginDto,
    @Res() res: Response,
  ): Promise<any> {
    return this.authService.login(req, res);
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  logout(
      @UserObj() user: User,
      @Res() res: Response,
  ) {
    return this.authService.logout(user, res);
  }
}
