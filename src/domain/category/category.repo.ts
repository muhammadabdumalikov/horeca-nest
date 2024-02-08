import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class CategoryRepo extends BaseRepo<any> {
  constructor() {
    super('categories');
  }
}
