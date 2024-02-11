import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class AdminCategoryRepo extends BaseRepo<any> {
  constructor() {
    super('categories');
  }
}
