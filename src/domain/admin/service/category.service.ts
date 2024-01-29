import { Injectable } from '@nestjs/common';
import { AdminCategoryRepo } from '../repo/category.repo';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from 'src/domain/admin/dto/category-admin.dto';
import { isEmpty } from 'lodash';
import { CategoryNotFoundException } from 'src/errors/permission.error';
import { ListPageDto } from 'src/shared/dto/list.dto';

@Injectable()
export class AdminCategoryService {
  constructor(private readonly adminCategoryRepo: AdminCategoryRepo) {}

  create(params: CreateCategoryDto) {
    return this.adminCategoryRepo.insert({
      name_uz: params.name_uz,
      name_ru: params.name_ru,
      name_lat: params.name_lat,
      parent_id: params.parent_id,
      image: params.image_url,
    });
  }

  async update(id: string, params: UpdateCategoryDto) {
    const category = await this.adminCategoryRepo.selectById(id);

    if (isEmpty(category)) {
      throw new CategoryNotFoundException();
    }

    return this.adminCategoryRepo.updateById(id, {
      name_uz: params?.name_uz,
      name_lat: params?.name_lat,
      name_ru: params?.name_ru,
      parent_id: params?.parent_id,
      image: params?.image_url,
    });
  }

  async delete(id: string) {
    const category = await this.adminCategoryRepo.selectById(id);

    if (isEmpty(category)) {
      throw new CategoryNotFoundException();
    }

    return this.adminCategoryRepo.softDelete(id);
  }

  async getAllCategories(params: ListPageDto) {
    return this.adminCategoryRepo.select(
      { is_deleted: false },
      { limit: params.limit, offset: params.offset },
    );
  }
}
