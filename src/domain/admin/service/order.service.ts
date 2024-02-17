import { Injectable } from '@nestjs/common';
import { AdminOrdersRepo } from '../repo/order.repo';
import { SetOrderStatusDto } from '../dto/product-admin.dto';
import { IListPage } from 'src/shared/interface/list.interface';
import { OrderListDto } from 'src/domain/orders/dto/order.dto';

@Injectable()
export class AdminOrderService {
  constructor(
    private readonly adminOrderRepo: AdminOrdersRepo,
  ) { }

  setStatus(params: SetOrderStatusDto) {
    return this.adminOrderRepo.updateById(params.order_id, {
      status: params.status,
    });
  }

  async orderList(params: OrderListDto) {
    const knex = this.adminOrderRepo.knex;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from(this.adminOrderRepo._tableName)
      .where('is_deleted', false)
      .orderBy('created_at', 'desc');
    
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
