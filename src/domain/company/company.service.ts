import { Injectable } from '@nestjs/common';
import { CompanyRepo } from './company.repo';
import { IListPage } from 'src/shared/interface/list.interface';
import { IUser } from '../user/interface/user.interface';
import { ICreateCompany } from './interface/company.interface';
import { isEmpty } from 'lodash';
import { CompanyNotFoundException } from 'src/errors/permission.error';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepo: CompanyRepo) { }

  async create(params: ICreateCompany) {
    return this.companyRepo.insert({
      name_uz: params.name_uz,
      name_ru: params.name_ru,
      country_uz: params.country_uz,
      country_ru: params.country_ru,
    });
  }

  async findAll(params: IListPage) {
    const knex = this.companyRepo.knexService.instance;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from('companies')
      .where('is_deleted', false)
      .orderBy('created_at', 'desc');

    if (params.limit) {
      query = query.limit(Number(params.limit));
    }

    if (params.offset) {
      query = query.offset(Number(params.offset));
    }
  
    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
  }

  async findOne(id: string) {
    const company = await this.companyRepo.selectById(id);
    if (isEmpty(company)) {
      throw new CompanyNotFoundException();
    }
    return company;;
  }
}
