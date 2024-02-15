import { Injectable } from '@nestjs/common';
import { CreatePaymentTypeDto, UpdatePaymentTypeDto } from './dto/create-payment-type.dto';
import { PaymentTypeRepo } from './payment_type.repo';
import { IListPage } from 'src/shared/interface/list.interface';
import { isEmpty } from 'lodash';
import { NotificationNotFoundException } from 'src/errors/permission.error';

@Injectable()
export class PaymentTypeService {
  constructor(private readonly paymentTypeRepo: PaymentTypeRepo) { }

  create(params: CreatePaymentTypeDto) {
    return this.paymentTypeRepo.insert({
      name_uz: params.name_uz,
      name_ru: params.name_ru,
    })
  }

  async findAll(params: IListPage) {
    const knex = this.paymentTypeRepo.knex;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from(this.paymentTypeRepo._tableName)
      .where('is_deleted', false)
      .orderBy('created_at', 'desc');

    if (params.limit) {
      query = query.limit(Number(params.limit));
    }

    if (params.offset) {
      query = query.offset(Number(params.offset));
    }

    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
  }

  async findAllForAdmi(params: IListPage) {
    const knex = this.paymentTypeRepo.knex;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from(this.paymentTypeRepo._tableName)
      .orderBy('created_at', 'desc');

    if (params.limit) {
      query = query.limit(Number(params.limit));
    }

    if (params.offset) {
      query = query.offset(Number(params.offset));
    }

    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: string, params: UpdatePaymentTypeDto) {
    return this.paymentTypeRepo.updateById(id, {
      name_uz: params?.name_uz,
      name_ru: params?.name_ru,
      is_deleted: params?.is_deleted === 'true'
    })
  }

  async delete(id: string) {
    const company = await this.paymentTypeRepo.selectById(id);

    if (isEmpty(company)) {
      throw new NotificationNotFoundException();
    }

    await this.paymentTypeRepo.softDelete(id);

    return { success: true };
  }
}
