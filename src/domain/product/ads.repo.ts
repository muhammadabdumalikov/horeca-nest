import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class AdsRepo extends BaseRepo<any> {
  constructor() {
    super('advertisements');
  }

  async getLastAds() {
    const knex = this.knexService.instance;

    const query = knex
      .select(['*'])
      .from(this._tableName)
      .whereRaw('is_deleted is not true')
      .orderBy('created_at', 'desc')
      .limit(5);

    return await query;
  }
}
