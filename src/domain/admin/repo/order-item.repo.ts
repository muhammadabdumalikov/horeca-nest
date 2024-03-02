import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class AdminOrderItemsRepo extends BaseRepo<any> {
  constructor() {
    super('order_items');
  }
}
