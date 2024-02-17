import { Injectable } from '@nestjs/common';
import { AdminOrdersRepo } from '../repo/order.repo';
import { SetOrderStatusDto } from '../dto/product-admin.dto';
import { ICurrentUser, IListPage } from 'src/shared/interface/list.interface';
import { OrderListByUsersDto, OrderListDto } from 'src/domain/orders/dto/order.dto';

@Injectable()
export class AdminOrderService {
  constructor(
    private readonly adminOrderRepo: AdminOrdersRepo,
  ) { }

  setStatus(params: SetOrderStatusDto, currentUser: ICurrentUser) {
    return this.adminOrderRepo.updateById(params.order_id, {
      status: params.status,
      updated_by: currentUser.id
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
}
