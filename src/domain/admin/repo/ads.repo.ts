import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class AdminAdvertisementRepo extends BaseRepo<any> {
  constructor() {
    super('advertisements');
  }
}
