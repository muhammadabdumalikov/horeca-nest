import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class AdminUserRepo extends BaseRepo<any> {
  constructor() {
    super('users');
  }
}
