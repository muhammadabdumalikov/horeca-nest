import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class NotificationRepo extends BaseRepo<any> {
  constructor() {
    super('notifications');
  }
}
