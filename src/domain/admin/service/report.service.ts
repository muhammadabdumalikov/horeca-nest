import { Injectable } from '@nestjs/common';
import { AdminOrdersRepo } from '../repo/order.repo';
import {
  FakturaReportListDto,
  GenerateAktSverkaReportDto,
  GenerateFakturaOrderReportDto,
  GenerateFakturaReportDto,
  SetFakturaReportArchiveDto
} from '../dto/report.dto';
import { isEmpty } from 'lodash';
import { AdminFakturaReportHistoryRepo } from '../repo/faktura-report-history';
import { krillToLatin, latinToKrill } from 'src/shared/utils/translate';

@Injectable()
export class ReportService {
  constructor(
    private readonly adminOrderRepo: AdminOrdersRepo,
    private readonly adminFakturaHistoryRepo: AdminFakturaReportHistoryRepo
  ) { }

  async getTotalOrdersReport(params: GenerateFakturaOrderReportDto, currentUser) {
    const knex = this.adminOrderRepo.knex;

    const query = knex
      .select([
        'order.order_number',
        knex.raw(`
          json_agg(
            jsonb_build_object(
              'name_uz', product.name_uz,
              'quantity', item.quantity,
              'total_price', item.quantity * item.price,
              'count_in_block', product.count_in_block
            )
          ) as order_items
        `)
      ])
      .from('orders as order')
      .join('order_items as item', function () {
        this.on('order.id', 'item.order_id').andOn(knex.raw('item.is_deleted = false'));
      })
      .leftJoin('products as product', function () {
        this.on('product.id', 'item.product_id')
      })
      .where('order.is_deleted', false)
      .whereIn('order.id', params.order_ids)
      .groupBy('order.id')
      .orderBy('order.order_number')
    
    const data = await query;

    return { data, currentUser };
  }

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

  async getFakturaOrder(params: GenerateFakturaOrderReportDto) {
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
        'client.phone as client_phone',
        'registrator.first_name as registrator_first_name',
        'registrator.last_name as registrator_last_name',
        'registrator.phone as registrator_phone',
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
      .whereIn('order.id', params.order_ids)
      .groupBy(['order.id', 'client.id', 'registrator.id']);

    return query;
  }

  async getActSverkaReport(params: GenerateAktSverkaReportDto) {
    const knex = this.adminOrderRepo.knex;

    const query = knex
      .select([
        'history.*',
        'user.balance',
        knex.raw(`
          CASE WHEN "user".person_type = 2 then "user".legal_name
              WHEN "user".person_type = 1 THEN "user".first_name || ' ' || "user".last_name
            END as user_name
        `),
      ])
      .from('users as user')
      .join('order_payment_history as history', function () {
        this.on('history.user_id', 'user.id');
      })
      .where('user.id', params.user_id)
      .where('history.user_id', params.user_id)
      .whereRaw(`"history".created_at between '${params.from_date}'::date and '${params.to_date}'::date`)
      .orderBy('history.created_at', 'asc');

    return query;
  }

  async fakturaReportList(params: FakturaReportListDto) {
    const knex = this.adminOrderRepo.knex;

    let query = knex
      .select([
        knex.raw('count("order".id) over() as total'),
        'order.id',
        'order.order_number',
        'order.total_sum',
        'order.comment',
        'order.payment_type_name',
        'order.reported',
        'order.created_at',
        knex.raw(`
          CASE WHEN client.person_type = 2 then client.legal_name
              WHEN client.person_type = 1 THEN client.first_name || ' ' || client.last_name
            END as client_name
        `),
        knex.raw('count("order".id) over() as total')
      ])
      .from('orders as order')
      .leftJoin('users as client', function () {
        this.on('client.id', 'order.user_id')
      })
      .whereRaw(`"order".created_at between '${params.from_date}'::date and '${params.to_date}'::date`);

    if (params?.is_archived === 'true') {
      query.where('order.reported', true)
    }

    if (params?.is_archived === 'false') {
      query.where('order.reported', false)
    }

    if (!isEmpty(params?.search)) {
      const name_latin = krillToLatin(params.search).replace(/'/g, "''");
      const name_krill = latinToKrill(params.search);
      query = query.andWhere((builder) =>
        builder
          .orWhere('client.first_name', `ilike`, `%${name_latin}%`)
          .orWhere('client.first_name', `ilike`, `%${name_krill}%`)
          .orWhere('client.last_name', `ilike`, `%${name_latin}%`)
          .orWhere('client.last_name', `ilike`, `%${name_krill}%`),
      );
    }

    if (params.limit) {
      query.limit(Number(params.limit));
    }

    if (params.offset) {
      query.offset(Number(params.offset));
    }

    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
  }

  async setFakturaReportArchive(params: SetFakturaReportArchiveDto) {
    return this.adminOrderRepo.updateById(params.order_id, { reported: true });
  }

  async getAllProductsListForExcel() {
    return this.adminOrderRepo.knex
      .select(['id', 'barcode', 'name_uz', 'name_ru', 'product_count'])
      .from('products')
      .where('is_deleted', false);
    // .orderBy('id');
  }

  async setRestProductCount(data) {
    return this.adminOrderRepo.knex.transaction(async (trx) => {
      const queryText = `
        UPDATE products
        SET product_count = product_updates.product_count
        FROM (VALUES 
          ${Object.entries(data).map(([id, product_count]) => `('${id}', ${product_count})`).join(',')}
          ) AS product_updates(id, product_count)
        WHERE products.id = product_updates.id;
      `;

      await trx.raw(queryText);

      return { success: true };
    })
  }
}
