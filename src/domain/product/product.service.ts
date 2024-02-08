import { Injectable } from '@nestjs/common';
import {
  CreateProductDto,
  ProductListByCategoryDto,
  SearchDto,
  UpdateProductDto,
} from './dto/product.dto';
import { ProductRepo } from './product.repo';
import { IUser } from '../user/interface/user.interface';
import {
  ProductNotFoundException,
  UserHasNotOwnerPermissionException,
} from 'src/errors/permission.error';
import { isEmpty } from 'lodash';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { IListPage } from 'src/shared/interface/list.interface';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepo,
  ) {}

  async create(params: CreateProductDto, currentUser: IUser) {
    currentUser;

    return this.productRepo.insert({
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
      block_count: +params?.block_count,
      measure: params?.measure,
    });
  }

  listByCategory(params: ProductListByCategoryDto, user: IUser) {
    return this.productRepo.listByCategory(params, user);
  }

  async findAll(params: IListPage) {
    const knex = this.productRepo.knexService.instance;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from('products')  
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

  getLastProducts() {
    return this.productRepo.select(
      { is_deleted: false },
      {
        limit: 10,
        order_by: { column: 'created_at', order: 'asc', use: true },
      },
    );
  }

  findOne(id: string) {
    return this.productRepo.selectById(id);
  }

  async update(id: string, params: UpdateProductDto) {
    const product = await this.productRepo.selectById(id);

    if (isEmpty(product)) {
      throw new ProductNotFoundException();
    }

    return await this.productRepo.updateById(id, {
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
      block_count: +params?.block_count,
      measure: params?.measure,
    });
  }

  async searchProductByName(params: SearchDto) {
    return this.productRepo.searchProductByName(params);
  }
}
