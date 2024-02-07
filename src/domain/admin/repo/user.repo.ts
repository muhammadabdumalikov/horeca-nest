import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class AdminUserRepo extends BaseRepo<any> {
  constructor() {
    super('users');
  }

  selectByPhone(phone: string, columns = ['*']) {
    return this.knex
      .select(columns)
      .from(this._tableName)
      .where('phone', phone)
      .first();
  }
}
