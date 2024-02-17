import { Injectable } from '@nestjs/common';
import { SetProductStatusDto } from '../dto/product-admin.dto';
import { AdminProductRepo } from '../repo/product.repo';
import { isEmpty } from 'lodash';
import { ProductNotFoundException } from 'src/errors/permission.error';
import { OrdersRepo } from 'src/domain/orders/orders.repo';
import { OrderListDto } from 'src/domain/orders/dto/order.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { CreateProductDto, UpdateProductDto } from 'src/domain/product/dto/product.dto';
import { IUser } from 'src/domain/user/interface/user.interface';
import { krillToLatin, latinToKrill } from 'src/shared/utils/translate';
import { AdminCategoryListPageDto } from '../dto/category-admin.dto';

@Injectable()
export class AdminProductService {
  constructor(
    private readonly adminProductRepo: AdminProductRepo,
    private readonly orderRepo: OrdersRepo,
  ) { }
  
  async create(params: CreateProductDto, currentUser: IUser) {
    currentUser;

    return this.adminProductRepo.insert({
      name_uz: params?.name_uz,
      name_ru: params?.name_ru,
      category_id: params?.category_id,
      company_id: params?.company_id,
      image: params?.image,
      count_price: +params?.count_price,
      block_price: +params?.block_price,
      discount_price: +params?.discount_price,
      description: params?.description,
      barcode: params.barcode,
      count_in_block: +params?.count_in_block,
      product_count: +params?.product_count,
      measure: params?.measure,
    });
  }

  async findAll(params: AdminCategoryListPageDto) {
    const knex = this.adminProductRepo.knexService.instance;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from('products')
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

  async delete(id: string) {
    const product = await this.adminProductRepo.selectById(id);

    if (isEmpty(product)) {
      throw new ProductNotFoundException();
    }

    await this.adminProductRepo.softDelete(id);

    return { success: true };
  }
  
  async update(id: string, params: UpdateProductDto) {
    const product = await this.adminProductRepo.selectById(id);

    if (isEmpty(product)) {
      throw new ProductNotFoundException();
    }

    return await this.adminProductRepo.updateById(id, {
      name_uz: params?.name_uz,
      name_ru: params?.name_ru,
      category_id: params?.category_id,
      company_id: params?.company_id,
      image: params?.image,
      count_price: +params?.count_price,
      block_price: +params?.block_price,
      discount_price: +params?.discount_price,
      description: params?.description,
      barcode: params.barcode,
      count_in_block: +params?.count_in_block,
      product_count: +params?.product_count,
      measure: params?.measure,
    });
  }
}
