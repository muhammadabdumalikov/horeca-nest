import { Injectable } from '@nestjs/common';
import { CompanyRepo } from './company.repo';
import { IUser } from '../user/interface/user.interface';
import { ICompanyList, ICreateCompany } from './interface/company.interface';
import { isEmpty } from 'lodash';
import { CompanyNotFoundException } from 'src/errors/permission.error';
import { IListPage } from 'src/shared/interface/list.interface';
import { UpdateCompanyDto } from './dto/company.dto';
import { SetCompanyStatusDto } from '../admin/dto/company.admin.dto';
import { AdminCategoryListPageDto } from '../admin/dto/category-admin.dto';
import { krillToLatin, latinToKrill } from 'src/shared/utils/translate';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepo: CompanyRepo) { }

  async create(params: ICreateCompany) {
    return this.companyRepo.insert({
      name: params.name,
      country_uz: params.country_uz,
      country_ru: params.country_ru,
    });
  }

  async findAll(params: AdminCategoryListPageDto) {
    const knex = this.companyRepo.knexService.instance;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from('companies')
      .orderBy('created_at', 'desc');
    
    if (!isEmpty(params?.search)) {
      const name_latin = krillToLatin(params.search).replace(/'/g, "''");
      const name_krill = latinToKrill(params.search);
      query = query.andWhere((builder) =>
        builder
          .orWhere('name_uz', `ilike`, `%${name_latin}%`)
          .orWhere('name_ru', `ilike`, `%${name_krill}%`),
      );
    }

    if (params.is_deleted === 'true') {
      query.where('is_deleted', true);
    }

    if (params.is_deleted === 'false') {
      query.where('is_deleted', false);
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

  async findOne(id: string) {
    const company = await this.companyRepo.selectById(id);
    if (isEmpty(company)) {
      throw new CompanyNotFoundException();
    }
    return company;;
  }

  async delete(id: string) {
    const company = await this.companyRepo.selectById(id);

    if (isEmpty(company)) {
      throw new CompanyNotFoundException();
    }

    await this.companyRepo.softDelete(id);

    return { success: true };
  }

  async update(id: string, params: UpdateCompanyDto) {
    const product = await this.companyRepo.selectById(id);

    if (isEmpty(product)) {
      throw new CompanyNotFoundException();
    }

    return await this.companyRepo.updateById(id, {
      name: params?.name,
      country_ru: params?.country_ru,
      country_uz: params?.country_uz,
      is_deleted: params?.is_deleted
    });
  }

  setStatus(params: SetCompanyStatusDto) {
    return this.companyRepo.updateById(params.company_id, {
      is_deleted: params.is_deleted === 'true',
    });
  }
}
