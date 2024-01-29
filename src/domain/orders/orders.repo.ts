import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class OrdersRepo extends BaseRepo<any> {
  constructor() {
    super('orders');
  }
}
