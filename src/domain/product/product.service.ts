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
import { AdsRepo } from './ads.repo';
import { ListPageDto } from 'src/shared/dto/list.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly adsRepo: AdsRepo,
  ) {}

  async create(params: CreateProductDto, currentUser: IUser) {
    currentUser;
    return this.productRepo.insert({
      name_uz: params?.name_uz,
      name_ru: params?.name_ru,
      category_id: params?.category_id,
      company_id: params?.company_id,
      image: params?.image,
      count_price: params?.count_price,
      block_price: params?.block_price,
      discount_price: params?.discount_price,
      description: params?.description,
      barcode: params.barcode,
      count_in_block: params?.count_in_block,
      block_count: params?.block_count,
      measure: params?.measure,
    });
  }

  getUserProducts(params: ListPageDto, user: IUser) {
    return this.productRepo.select(
      { is_deleted: false, owner_id: user.id },
      { limit: params.limit, offset: params.offset },
    );
  }

  listByCategory(params: ProductListByCategoryDto, user: IUser) {
    return this.productRepo.listByCategory(params, user);
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

  async update(id: string, params: UpdateProductDto, currentUser: IUser) {
    const product = await this.productRepo.selectById(id);

    if (isEmpty(product)) {
      throw new ProductNotFoundException();
    }

    if (product.owner_id !== currentUser.id) {
      throw new UserHasNotOwnerPermissionException();
    }

    return await this.productRepo.updateById(id, {
      name_uz: params?.name_uz,
      name_ru: params?.name_ru,
      category_id: params?.category_id,
      company_id: params?.company_id,
      image: params?.image,
      count_price: params?.count_price,
      block_price: params?.block_price,
      discount_price: params?.discount_price,
      description: params?.description,
      barcode: params.barcode,
      count_in_block: params?.count_in_block,
      block_count: params?.block_count,
      measure: params?.measure,
    });
  }

  async delete(id: string, user: IUser) {
    const product = await this.productRepo.selectById(id);

    if (isEmpty(product)) {
      throw new ProductNotFoundException();
    }

    if (product.owner_id !== user.id) {
      throw new UserHasNotOwnerPermissionException();
    }

    await this.productRepo.softDelete(id);

    return { success: true };
  }

  async searchProductByName(params: SearchDto) {
    return this.productRepo.searchProductByName(params);
  }

  async getlastAds() {
    return this.adsRepo.getLastAds();
  }
}
