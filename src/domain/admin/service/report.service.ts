import { Injectable } from '@nestjs/common';
import { AdminOrdersRepo } from '../repo/order.repo';
import { GenerateAktSverkaReportDto, GenerateFakturaReportDto } from '../dto/report.dto';
import { isEmpty } from 'lodash';

@Injectable()
export class ReportService {
  constructor(private readonly adminOrderRepo: AdminOrdersRepo) { }

  async getFakturaReport(params: GenerateFakturaReportDto) {
    const knex = this.adminOrderRepo.knex;

    const query = knex
      .select([
        'order.id',
        'order.total_sum',
        'order.created_at',
        'order.location',
        knex.raw(`
          CASE WHEN client.person_type = 2 then client.legal_name
              WHEN client.person_type = 1 THEN client.first_name || ' ' || client.last_name
            END as client_name
        `),
        'client.phone',
        'registrator.first_name as registrator_first_name',
        'registrator.last_name as registrator_last_name',
        'order.payment_type_name',
        knex.raw(`
          json_agg(json_build_object(
            'name_uz', product.name_uz,
            'quantity', item.quantity,
            'price', item.price,
            'total_sum', item.price::int * item.quantity
          )) as items
        `),
        'order.deliver_id',
        'order.deliver_user_json',
      ])
      .from('orders as order')
      .join('order_items as item', function () {
        this.on('item.order_id', 'order.id')
      })
      .leftJoin('products as product', function () {
        this.on('product.id', 'item.product_id')
      })
      .leftJoin('users as registrator', function () {
        this.on('registrator.id', 'order.registrator_id')
      })
      .leftJoin('users as client', function () {
        this.on('client.id', 'order.user_id')
      })
      .whereRaw(`"order".created_at between '${params.from_date}'::date and '${params.to_date}'::date`)
      .groupBy(['order.id', 'client.id', 'registrator.id']);

    if (!isEmpty(params.user_ids)) {
      query.whereIn('client.id', params.user_ids)
    }

    return query;
  }

  async getActSverkaReport(params: GenerateAktSverkaReportDto) {
    const knex = this.adminOrderRepo.knex;

    const query = knex
      .select('history.*')
      .from('order_payment_history as history')
      .where('history.user_id', params.user_id)
      .whereRaw(`"history".created_at between '${params.from_date}'::date and '${params.to_date}'::date`)
      .orderBy('history.created_at', 'asc');

    return query;
  }
}
