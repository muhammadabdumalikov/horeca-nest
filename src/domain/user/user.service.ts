import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserRepo } from './user.repo';
import { UserRoles } from './enum/user.enum';
import { IUser } from './interface/user.interface';
import { PhoneAlreadyRegistered } from 'src/errors/permission.error';
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

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    return this.userRepo.selectById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
