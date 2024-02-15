import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserRepo } from './user.repo';
import { PersonType, UserRoles } from './enum/user.enum';
import { IUpdateUser, IUser } from './interface/user.interface';
import { PhoneAlreadyRegistered, UserNotFoundException } from 'src/errors/permission.error';
import { sendSmsTo } from 'src/providers/sms-sender.service';
import { nanoid } from "nanoid";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
  ) {}

  async signUp(params: CreateUserDto) {
    return this.userRepo.knex
      .transaction(async () => {
        const hasUser: IUser = await this.userRepo.selectByPhone(params.phone);

        if (hasUser) {
          throw new PhoneAlreadyRegistered();
        }

        const messageKey = nanoid(15);
        const otp = Math.floor(10000 + Math.random() * 90000);

        const [user]: [IUser] = await this.userRepo.insert({
          phone: params.phone,
          role: UserRoles.SELLER,
          otp: otp,
        });

        await sendSmsTo(params.phone, messageKey, otp);

        return { otp: user.otp, phone: user.phone };
      })
      .then((data) => {
        return data;
      });
  }

  getOwnProfile(currentUser: IUser) {
    return this.userRepo.selectById(currentUser.id);
  }

  async findOne(id: string) {
    return this.userRepo.selectById(id);
  }

  async update(currentUser: IUser, params: IUpdateUser) {
    const hasUser: IUser = await this.userRepo.selectById(currentUser.id);

    if (!hasUser) {
      throw new UserNotFoundException();
    }

    return this.userRepo.updateById(currentUser.id, {
      first_name: params?.first_name,
      last_name: params?.last_name,
      person_type: params?.person_type,
      legal_name: params?.person_type === PersonType.JURIDIC ? params?.legal_name : null,
      additional_name: params?.additional_name,
      address: params?.address,
      auth_status: hasUser.first_name || params?.first_name ? true : false,
    })
  }

  async delete(id: string) {
    const user = await this.userRepo.selectById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return this.userRepo.softDeleteUser(id);
  }
}
