import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class OrderPaymentHistoryRepo extends BaseRepo<any> {
  constructor() {
    super('order_payment_history');
  }
}
