import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class AdminProductRepo extends BaseRepo<any> {
  constructor() {
    super('products');
  }
}
