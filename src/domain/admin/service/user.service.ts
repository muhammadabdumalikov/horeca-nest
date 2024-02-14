import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminUserRepo } from '../repo/user.repo';
import { AdminLoginDto, CreateWorkerDto, SetUserStatusDto } from '../dto/user-admin.dto';
import { isEmpty } from 'lodash';
import { IncorrectLoginException, IncorrectPasswordException, PhoneAlreadyRegistered, UserHasNotPermissionException, UserNotFoundException } from 'src/errors/permission.error';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { UserRoles } from 'src/domain/user/enum/user.enum';
import { IUser } from 'src/domain/user/interface/user.interface';
import { createPasswordHash, validateUserPassword } from 'src/shared/utils/password-hash';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly adminUserRepo: AdminUserRepo,
    private readonly jwtService: JwtService
  ) { }

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

  async adminLogin(params: AdminLoginDto) {
    const user: IUser = await this.adminUserRepo.selectByLogin(params.login);

    if (!user) {
      throw new IncorrectLoginException();
    }

    const check = await validateUserPassword(user.password, params.password);

    if (!check) {
      throw new IncorrectPasswordException();
    }

    if (user.role !== UserRoles.ADMIN) {
      throw new UserHasNotPermissionException();
    }

    const token = await this.jwtService.signAsync(
      { id: user.id, auth_status: user.auth_status, role: user.role },
      { privateKey: 'store-app' },
    );

    return { auth_status: user.auth_status, token };
  }

  async createworker(params: CreateWorkerDto) {
      return this.adminUserRepo.knex
        .transaction(async () => {
          const hasUser: IUser = await this.adminUserRepo.selectByPhone(params.phone);

          if (hasUser) {
            throw new PhoneAlreadyRegistered();
          }
          const password = await createPasswordHash(params.password);
          // const check = validateUserPassword(password, '12343');

          const [user]: [IUser] = await this.adminUserRepo.insert({
            phone: params.phone,
            role: params.role,
            first_name: params.first_name,
            last_name: params.last_name,
            login: params.login,
            password,
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
