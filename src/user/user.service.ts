import { Inject, Injectable } from '@nestjs/common';
import striptags from 'striptags';
import { RegisterDto } from './dto/register.dto';
import { RegisterUserResponse, VerifyUserResponse } from '../types';
import { User } from './user.entity';
import { MailService } from '../mail/mail.service';
import { verifyEmailInfoTemplate } from '../templates/email/verify-email-info';
import { hashPwd } from '../utils/hash-pwd';

@Injectable()
export class UserService {
  constructor(
    @Inject(MailService) private mailService: MailService,
  ) { }

  filter(user: User) {
    const {id, email, nickname} = user;

    return {
      id, email, nickname,
    };
  }

  async register(newUser: RegisterDto): Promise<RegisterUserResponse> {
    const foundUser = await User.findOneBy({
      email: newUser.email,
    });

    try {
      if (!foundUser) {
        const user = new User();
        user.email = newUser.email;
        user.nickname = newUser.nickname;
        user.pwdHash = hashPwd(newUser.pwd);
        await user.save();

        // await this.mailService.sendMail(user.email, 'Aro ShopApp email verification', verifyEmailInfoTemplate(striptags(user.email), striptags(user.nickname), user.id));

        return this.filter(user);
      }
    } catch (e) {
      console.error(e);
    }

    return {
      isSuccess: false,
      message: `User with email '${striptags(newUser.email)}' already exists. Please try to login or recover your password.`,
    };
  }

  async getOneUser(id: string): Promise<User> {
    return User.findOneBy({ id });
  }

  async verifyEmail(id: string): Promise<VerifyUserResponse> {
    const foundUser = await User.findOneBy({id});

    if (!foundUser) {
      return {
        isSuccess: false,
        message: 'User not found.',
      };
    }

    foundUser.emailVerified = true;

    await foundUser.save();

    return {
      isSuccess: true,
    };
  }
}
