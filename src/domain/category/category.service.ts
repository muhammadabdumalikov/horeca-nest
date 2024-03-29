import { Injectable } from '@nestjs/common';
import { CategoryRepo } from './category.repo';
import { IListPage } from 'src/shared/interface/list.interface';
import { isEmpty } from 'lodash';
import { CategoryNotFoundException } from 'src/errors/permission.error';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async findAll(params: IListPage) {
    const knex = this.categoryRepo.knexService.instance;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from(this.categoryRepo._tableName)
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
    const category = await this.categoryRepo.selectById(id);

    if (isEmpty(category)) {
      throw new CategoryNotFoundException();
    }
    return category;
  }
}
