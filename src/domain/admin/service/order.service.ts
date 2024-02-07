import { Injectable } from '@nestjs/common';
import { AdminOrdersRepo } from '../repo/order.repo';
import { SetOrderStatusDto } from '../dto/product-admin.dto';

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
}
