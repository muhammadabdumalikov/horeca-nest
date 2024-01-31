import { Injectable } from '@nestjs/common';
import { AdminUserRepo } from '../repo/user.repo';
import { SetUserStatusDto } from '../dto/user-admin.dto';
import { isEmpty } from 'lodash';
import { EmailAlreadyRegistered, UserNotFoundException } from 'src/errors/permission.error';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { CreateUserDto } from 'src/domain/user/dto/user.dto';
import { UserRoles, UserStatus } from 'src/domain/user/enum/user.enum';
import { IUser } from 'src/domain/user/interface/user.interface';

@Injectable()
export class AdminUserService {
  constructor(private readonly adminUserRepo: AdminUserRepo) {}

  setStatus(params: SetUserStatusDto) {
    return this.adminUserRepo.updateById(params.user_id, {
      status: params.status,
    });
  }

  findAll(params: ListPageDto) {
    return this.adminUserRepo.select(
      {
        is_deleted: false,
      },
      {
        limit: params.limit,
        offset: params.offset,
        order_by: { column: 'created_at', order: 'desc', use: true },
      },
    );
  }

  async delete(id: string) {
    const user = await this.adminUserRepo.selectById(id);

    if (isEmpty(user)) {
      throw new UserNotFoundException();
    }

    await this.adminUserRepo.softDelete(id);

    return { success: true };
  }

  async createSuperAdmin(params: CreateUserDto) {
    const hasEmail: IUser = await this.adminUserRepo.selectByEmail(
      params.phone,
    );

    if (hasEmail) {
      throw new EmailAlreadyRegistered();
    }

    const [user]: [IUser] = await this.adminUserRepo.insert({
      phone: params.phone,
      role: UserRoles.ADMIN,
      status: UserStatus.ACTIVE,
      email: params.phone,
    });

    return user;
  }

  findAllAdmins(params: ListPageDto) {
    return this.adminUserRepo.select(
      {
        is_deleted: false,
        role: UserRoles.ADMIN,
      },
      {
        limit: params.limit,
        offset: params.offset,
        order_by: { column: 'created_at', order: 'desc', use: true },
      },
    );
  }
}
