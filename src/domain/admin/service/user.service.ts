import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminUserRepo } from '../repo/user.repo';
import { AdminLoginDto, AdminUsersListDto, CreateWorkerDto, SetUserStatusDto } from '../dto/user-admin.dto';
import { isEmpty } from 'lodash';
import { IncorrectLoginException, IncorrectPasswordException, PhoneAlreadyRegistered, UserHasNotPermissionException, UserNotFoundException } from 'src/errors/permission.error';
import { UserRoles } from 'src/domain/user/enum/user.enum';
import { IUser } from 'src/domain/user/interface/user.interface';
import { createPasswordHash, validateUserPassword } from 'src/shared/utils/password-hash';
import { JwtService } from '@nestjs/jwt';
import { krillToLatin, latinToKrill } from 'src/shared/utils/translate';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly adminUserRepo: AdminUserRepo,
    private readonly jwtService: JwtService
  ) { }

  setStatus(params: SetUserStatusDto) {
    return this.adminUserRepo.updateById(params.user_id, {
      is_deleted: params.is_deleted === 'true',
      is_block: params.is_block === 'true',
    });
  }

  async findAll(params: AdminUsersListDto) {
    const knex = this.adminUserRepo.knexService.instance;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from('users')
      .orderBy('created_at', 'desc');
    
    if (params?.role) {
      query.where('role', Number(params.role));
    }


    if (params.is_deleted === 'true') {
      query.where('is_deleted', true);
    }

    if (params.is_deleted === 'false') {
      query.where('is_deleted', false);
    }

    if (!isEmpty(params?.search)) {
      const name_latin = krillToLatin(params.search).replace(/'/g, "''");
      const name_krill = latinToKrill(params.search);
      query = query.andWhere((builder) =>
        builder
          .orWhere('first_name', `ilike`, `%${name_latin}%`)
          .orWhere('first_name', `ilike`, `%${name_krill}%`)
          .orWhere('last_name', `ilike`, `%${name_krill}%`)
          .orWhere('last_name', `ilike`, `%${name_krill}%`),

      );
    }

    if (params.limit) {
      query = query.limit(Number(params.limit));
    }

    if (params.offset) {
      query = query.offset(Number(params.offset));
    }

    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
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

    // if (user.role === UserRoles.ADMIN) {
    //   throw new UserHasNotPermissionException();
    // }

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

  async findAllAdmins(params: AdminUsersListDto) {
    const knex = this.adminUserRepo.knexService.instance;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from('users')
      .orderBy('created_at', 'desc');

    if (params?.role) {
      query.where('role', Number(params.role));
    } else {
      query.whereIn('role', [UserRoles.ADMIN, UserRoles.DELIVER]);
    }


    if (params.is_deleted === 'true') {
      query.where('is_deleted', true);
    }

    if (params.is_deleted === 'false') {
      query.where('is_deleted', false);
    }

    if (!isEmpty(params?.search)) {
      const name_latin = krillToLatin(params.search).replace(/'/g, "''");
      const name_krill = latinToKrill(params.search);
      query = query.andWhere((builder) =>
        builder
          .orWhere('first_name', `ilike`, `%${name_latin}%`)
          .orWhere('first_name', `ilike`, `%${name_krill}%`)
          .orWhere('last_name', `ilike`, `%${name_krill}%`)
          .orWhere('last_name', `ilike`, `%${name_latin}%`),
      );
    }

    if (params.limit) {
      query = query.limit(Number(params.limit));
    }

    if (params.offset) {
      query = query.offset(Number(params.offset));
    }

    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
  }
}
