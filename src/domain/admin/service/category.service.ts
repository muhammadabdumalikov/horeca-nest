import { Injectable } from '@nestjs/common';
import { AdminCategoryRepo } from '../repo/category.repo';
import {
  AdminCategoryListPageDto,
  CreateCategoryDto,
  SetCategoryStatusDto,
  UpdateCategoryDto,
} from 'src/domain/admin/dto/category-admin.dto';
import { isEmpty } from 'lodash';
import { CategoryNotFoundException } from 'src/errors/permission.error';
import { krillToLatin, latinToKrill } from 'src/shared/utils/translate';

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

  async findAll(params: AdminCategoryListPageDto) {
    const knex = this.adminCategoryRepo.knexService.instance;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from('categories')
      .orderBy('created_at', 'desc');


    if (params.is_deleted === 'true') {
      query.where('is_deleted', true);
    }

    if (params.is_deleted === 'false') {
      query.where('is_deleted', false);
    }

    if (params?.search) {
      const name_latin = krillToLatin(params.search).replace(/'/g, "''");
      const name_krill = latinToKrill(params.search);
      query = query.andWhere((builder) =>
        builder
          .orWhere('name_uz', `ilike`, `%${name_latin}%`)
          .orWhere('name_ru', `ilike`, `%${name_krill}%`),
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

  setStatus(params: SetCategoryStatusDto) {
    return this.adminCategoryRepo.updateById(params.category_id, {
      is_deleted: params.is_deleted === 'true',
    });
  }
}
