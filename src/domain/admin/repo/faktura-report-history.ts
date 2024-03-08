import { Injectable } from '@nestjs/common';
import { BaseRepo } from 'src/providers/base-dao';

@Injectable()
export class AdminFakturaReportHistoryRepo extends BaseRepo<any> {
  constructor() {
    super('faktura_report_history');
  }

  async archiveByOrderId(order_id: string) {
    const data = this.knex
      .update({ is_archived: true })
      .from(this._tableName)
      .where('order_id', order_id)

    await data;

    return { success: true };
  }
}
