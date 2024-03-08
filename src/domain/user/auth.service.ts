import { Injectable } from '@nestjs/common';
import { ConfirmOtpDto, UserLoginDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from './user.repo';
import {
  IncorrectOtpException,
  UserNotFoundException,
} from 'src/errors/permission.error';
import { IUser } from './interface/user.interface';
import { EmailConfirmationService } from './email-confirmaton.service';
import { sendSmsTo } from 'src/providers/sms-sender.service';
import { nanoid } from 'nanoid';
import { UserRoles } from './enum/user.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepo,
  ) { }

  async confirmOtp(params: ConfirmOtpDto) {
    const user: IUser = await this.userRepo.selectByPhone(params.phone);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.otp !== params.otp) {
      throw new IncorrectOtpException();
    }

    // const updatedUser: IUser = await this.userRepo.updateById(user.id, { auth_status: true })

    const token = await this.jwtService.signAsync(
      { id: user.id, auth_status: user.auth_status, role: user.role, super_user: user.super_user },
      { privateKey: 'store-app' },
    );

    return { auth_status: user.auth_status, token };
  }



  async login(params: UserLoginDto) {
    const messageKey = nanoid(15);
    const otp = Math.floor(10000 + Math.random() * 90000);

    var user: IUser = await this.userRepo.selectByPhone(params.phone);

    if (user) {
      await this.userRepo.updateById(user.id, {
        otp: otp,
      });
    } else {
      user = await this.userRepo.insert({
        phone: params.phone,
        role: UserRoles.CLIENT,
        otp: otp,
      });
    }

    await sendSmsTo(params.phone, messageKey, otp);

    return { otp: otp, phone: user.phone };
  }
}
