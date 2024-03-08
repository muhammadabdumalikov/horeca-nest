import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class AdminOrderPaymentHistoryRepo extends BaseRepo<any> {
  constructor() {
    super('order_payment_history');
  }
}
