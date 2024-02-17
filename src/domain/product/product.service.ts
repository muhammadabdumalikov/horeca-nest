import { Injectable } from '@nestjs/common';
import {
  CreateProductDto,
  ProductListByCategoryDto,
  ProductListDto,
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

  listByCategory(params: ProductListDto, user: IUser) {
    return this.productRepo.listByCategory(params);
  }

  async findAll(params: IListPage) {
    const data = await this.productRepo.listByCategory(params);

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

  async findOne(id: string) {
    const knex = this.productRepo.knex;

    const product = await knex
      .select([
        'p.*',
        knex.raw(`
          jsonb_build_object(
            'name_uz', c.name_uz,
            'name_ru', c.name_ru
          ) as company
        `),
        knex.raw(`
          jsonb_build_object(
            'name_uz', category.name_uz,
            'name_ru', category.name_ru
          ) as category 
        `)
      ])
      .from('products as p')
      .leftJoin('companies as c', function () {
        this.on('p.company_id', 'c.id').andOn(knex.raw('c.is_deleted = false'))
      })
      .leftJoin('categories as category', function () {
        this.on('p.category_id', 'category.id').andOn(knex.raw('category.is_deleted = false'))
      })
      .where('p.id', id)
      .whereNot('p.is_deleted', true)
      .first();
    
    if (isEmpty(product)) {
      throw new ProductNotFoundException();
    }

    return product;
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
      block_count: +params?.product_count,
      measure: params?.measure,
    });
  }

  async searchProductByName(params: SearchDto) {
    return this.productRepo.searchProductByName(params);
  }
}
