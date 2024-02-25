import { Injectable } from '@nestjs/common';
import { AdminOrdersRepo } from '../repo/order.repo';
import { SetDeliverDto, SetOrderStatusDto } from '../dto/product-admin.dto';
import { ICurrentUser, IListPage } from 'src/shared/interface/list.interface';
import { OrderListByUsersDto, OrderListDto } from 'src/domain/orders/dto/order.dto';
import { OrderStatus } from 'src/domain/orders/dto/order.enum';
import { AdminProductRepo } from '../repo/product.repo';
import { OrderAlreadyDeliveredException } from 'src/errors/permission.error';

@Injectable()
export class AdminOrderService {
  constructor(
    private readonly adminOrderRepo: AdminOrdersRepo,
    private readonly adminProductRepo: AdminProductRepo,
  ) { }

  setStatus(params: SetOrderStatusDto, currentUser: ICurrentUser) {
    return this.adminOrderRepo.knex.transaction(async (trx) => {
      await this.adminOrderRepo.updateByIdWithTransaction(trx, params.order_id, {
        status: params.status,
        updated_by: currentUser.id
      });

      if (params.status === OrderStatus.REJECTED) {
        const order_items = await this.adminOrderRepo.knex
          .select(['product_id', 'quantity'])
          .from('order_items')
          .where('order_id', params.order_id)
          .where('is_deleted', false);
        
        for await (let item of order_items) {
          const product = await this.adminProductRepo.selectById(item.product_id);
          await this.adminProductRepo.updateByIdWithTransaction(
            trx,
            item.product_id,
            { product_count: Number(product.product_count) + Number(item.quantity) }
          );
        } 
      }

      return { success: true };
    });
  }

  setDeliver(params: SetDeliverDto, currentUser: ICurrentUser) {
    return this.adminOrderRepo.knex.transaction(async (trx) => {
      const order = await this.adminOrderRepo.selectById(params.order_id);

      if (order.status === OrderStatus.DELIVERED) {
        throw new OrderAlreadyDeliveredException();
      }

      await this.adminOrderRepo.updateByIdWithTransaction(trx, params.order_id, {
        deliver_id: params.deliver_id,
        updated_by: currentUser.id
      });

      return { success: true };
    });
  }

  async orderList(params: OrderListDto) {
    const knex = this.adminOrderRepo.knex;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from(this.adminOrderRepo._tableName)
      .orderBy('created_at', 'desc');

    if (params?.is_deleted === 'true') {
      query.where('is_deleted', true);
    }

    if (params?.is_deleted === 'false') {
      query.where('is_deleted', false);
    }

    if (params?.status) {
      query.where('status', params.status)
    }

    if (params.limit) {
      query.limit(Number(params.limit));
    }

    if (params.offset) {
      query.offset(Number(params.offset));
    }

    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
  }

  async orderListByUsers(params: OrderListByUsersDto) {
    const knex = this.adminOrderRepo.knex;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from(this.adminOrderRepo._tableName)
      .orderBy('created_at', 'desc');

    if (params?.user_id) {
      query.where('user_id', params.user_id)
    }

    if (params?.is_deleted === 'true') {
      query.where('is_deleted', true);
    }

    if (params?.is_deleted === 'false') {
      query.where('is_deleted', false);
    }

    if (params?.status) {
      query.where('status', params.status)
    }

    if (params.limit) {
      query.limit(Number(params.limit));
    }

    if (params.offset) {
      query.offset(Number(params.offset));
    }

    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
  }

  async orderListByDeliver(params: OrderListByUsersDto, user) {
    const knex = this.adminOrderRepo.knex;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from(this.adminOrderRepo._tableName)
      .where('deliver_id', user.id)
      .orderBy('created_at', 'desc');

    if (params?.is_deleted === 'true') {
      query.where('is_deleted', true);
    }

    if (params?.is_deleted === 'false') {
      query.where('is_deleted', false);
    }

    if (params?.status) {
      query.where('status', params.status)
    }

    if (params.limit) {
      query.limit(Number(params.limit));
    }

    if (params.offset) {
      query.offset(Number(params.offset));
    }

    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
  }

  async findOne(id: string) {
    const knex = this.adminProductRepo.knex;

    const product = knex
      .select([
        'o.*',
        knex.raw(`
          json_agg(
            jsonb_build_object(
              'name_uz', product.name_uz,
              'name_ru', product.name_ru,
              'quantity', item.quantity,
              'barcode', product.barcode,
              'image', product.image,
              'count_price', product.count_price,
              'discount_price', product.discount_price,
              'block_price', product.block_price,
              'count_in_block', product.count_in_block 
            )
          ) as order_items
        `)
      ])
      .from('orders as o')
      .leftJoin('order_items as item', function () {
        this.on('item.order_id', 'o.id').andOn(knex.raw('o.is_deleted = false'))
      })
      .leftJoin('products as product', function () {
        this.on('product.id', 'item.product_id').andOn(knex.raw('product.is_deleted = false'))
      })
      .where('o.id', id)
      .groupBy('o.id')
      .first();
      
    return product;
  }
}
