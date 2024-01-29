import { Injectable } from '@nestjs/common';
import { SetProductStatusDto } from '../dto/product-admin.dto';
import { AdminProductRepo } from '../repo/product.repo';
import { isEmpty } from 'lodash';
import { ProductNotFoundException } from 'src/errors/permission.error';
import { OrdersRepo } from 'src/domain/orders/orders.repo';
import { OrderListDto } from 'src/domain/orders/dto/order.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';

@Injectable()
export class AdminProductService {
  constructor(
    private readonly adminProductRepo: AdminProductRepo,
    private readonly orderRepo: OrdersRepo,
  ) {}

  setStatus(params: SetProductStatusDto) {
    return this.adminProductRepo.updateById(params.product_id, {
      status: params.status,
    });
  }

  findAll(params: ListPageDto) {
    return this.adminProductRepo.select(
      {
        is_deleted: false,
      },
      {
        limit: params.limit,
        offset: params.offset,
        order_by: { column: 'created_at', order: 'desc', use: true },
      },
    );
  }

  async delete(id: string) {
    const product = await this.adminProductRepo.selectById(id);

    if (isEmpty(product)) {
      throw new ProductNotFoundException();
    }

    await this.adminProductRepo.softDelete(id);

    return { success: true };
  }

  async orderList(params: OrderListDto) {
    return await this.orderRepo.select(
      {
        status: Number(params.status),
        is_deleted: false,
      },
      {
        limit: params.limit,
        offset: params.offset,
        order_by: { column: 'created_at', order: 'desc', use: true },
      },
    );
  }
}
