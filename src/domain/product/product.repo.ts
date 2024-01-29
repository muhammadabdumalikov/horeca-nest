import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';
import { ProductListByCategoryDto, SearchDto } from './dto/product.dto';
import { IUser } from '../user/interface/user.interface';
import { SortType } from './enum/product.enum';
import { krillToLatin, latinToKrill } from 'src/shared/utils/translate';

@Injectable()
export class ProductRepo extends BaseRepo<any> {
  constructor() {
    super('products');
  }

  listByCategory(params: ProductListByCategoryDto, user: IUser) {
    const knex = this.knexService.instance;

    const query = knex
      .select([
        'product.id',
        'product.name_uz',
        'product.name_ru',
        'product.price',
        knex.raw('coalesce(product.sale_price, product.price) as sale_price'),
        'product.count',
        'product.image',
        knex.raw(
          'coalesce(round(100 - ((product.sale_price / product.price) * 100)), 0) as discount',
        ),
      ])
      .from('products as product')
      // .join('category', function () {
      //   this.on('category.id', 'product.category_id')
      //     .andOn(knex.raw('category.is_deleted is not true'))
      //     .andOn(knex.raw(`category.id = '${params.category_id}'`));
      // })
      .whereRaw(`product.category_id = '${params.category_id}'`)
      .whereRaw('product.is_deleted is not true');

    if (params.sort) {
      switch (params.sort) {
        case SortType.EXPENSIVE:
          query.orderBy('product.price', 'desc');
          break;

        case SortType.CHEAP:
          query.orderBy('product.price', 'asc');
          break;

        case SortType.DISCOUNT:
          query.orderBy('discount', 'desc');
          break;

        case SortType.RATING:
          break;

        case SortType.POPULAR:
          query.orderBy('product.price', 'desc');
          break;
      }
    }

    if (params.from_price) {
      query.whereRaw(
        `sale_price >= ${params.from_price} and sale_price <= ${params.to_price}`,
      );
    }

    if (params.limit) {
      query.limit(Number(params.limit)).offset(Number(params.offset));
    }

    return query;
  }

  async searchProductByName(params: SearchDto) {
    const knex = this.knexService.instance;

    let query = knex
      .select([
        'product.id',
        'product.name_uz',
        'product.name_ru',
        'product.price',
        knex.raw('coalesce(product.sale_price, product.price) as sale_price'),
        'product.count',
        'product.image',
        knex.raw(
          'coalesce(round(100 - ((product.sale_price / product.price) * 100)), 0) as discount',
        ),
      ])
      .from('products as product')
      .whereRaw('product.is_deleted is not true');

    const searchArr = params.name.trim().split(` `) || [];
    for (const search of searchArr) {
      const name_latin = krillToLatin(search).replace(/'/g, "''");
      const name_krill = latinToKrill(search);
      query = query.andWhere((builder) =>
        builder
          .orWhere('product.name_uz', `ilike`, `%${name_latin}%`)
          .orWhere('product.name_ru', `ilike`, `%${name_krill}%`),
      );
    }

    return query;
  }
}
