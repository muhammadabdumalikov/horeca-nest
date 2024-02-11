import { Injectable } from '@nestjs/common';
import { AdminCategoryRepo } from '../repo/category.repo';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from 'src/domain/admin/dto/category-admin.dto';
import { isEmpty } from 'lodash';
import { CategoryNotFoundException } from 'src/errors/permission.error';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { ICompanyList } from 'src/domain/company/interface/company.interface';

@Injectable()
export class AdminCategoryService {
  constructor(private readonly adminCategoryRepo: AdminCategoryRepo) {}

  create(params: CreateCategoryDto) {
    return this.adminCategoryRepo.insert({
      name_uz: params.name_uz,
      name_ru: params.name_ru,
    });
  }

  async update(id: string, params: UpdateCategoryDto) {
    const category = await this.adminCategoryRepo.selectById(id);

    if (isEmpty(category)) {
      throw new CategoryNotFoundException();
    }

    return this.adminCategoryRepo.updateById(id, {
      name_uz: params?.name_uz,
      name_ru: params?.name_ru,
    });
  }

  async delete(id: string) {
    const category = await this.adminCategoryRepo.selectById(id);

    if (isEmpty(category)) {
      throw new CategoryNotFoundException();
    }

    return this.adminCategoryRepo.softDelete(id);
  }

  async findAll(params: ICompanyList) {
    const knex = this.adminCategoryRepo.knexService.instance;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from('companies')
      .orderBy('created_at', 'desc');


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
}
