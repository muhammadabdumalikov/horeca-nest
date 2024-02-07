import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class AdminOrdersRepo extends BaseRepo<any> {
  constructor() {
    super('orders');
  }
}
