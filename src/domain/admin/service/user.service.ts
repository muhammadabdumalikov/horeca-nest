import { Injectable } from '@nestjs/common';
import { AdminUserRepo } from '../repo/user.repo';
import { CreateWorkerDto, SetUserStatusDto } from '../dto/user-admin.dto';
import { isEmpty } from 'lodash';
import { PhoneAlreadyRegistered, UserNotFoundException } from 'src/errors/permission.error';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { UserRoles } from 'src/domain/user/enum/user.enum';
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

  async createworker(params: CreateWorkerDto) {
      return this.adminUserRepo.knex
        .transaction(async () => {
          const hasUser: IUser = await this.adminUserRepo.selectByPhone(params.phone);

          if (hasUser) {
            throw new PhoneAlreadyRegistered();
          }

          const [user]: [IUser] = await this.adminUserRepo.insert({
            phone: params.phone,
            role: params.role,
            first_name: params.first_name,
            last_name: params.last_name,
            auth_status: true
          });

          return { success: true, user };
        })
        .then((data) => {
          return data;
        });
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
