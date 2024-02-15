import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class PaymentTypeRepo extends BaseRepo<any> {
  constructor() {
    super('payment_types');
  }
}
