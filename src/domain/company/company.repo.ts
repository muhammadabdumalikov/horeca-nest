import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class CompanyRepo extends BaseRepo<any> {
  constructor() {
    super('companies');
  }
}
