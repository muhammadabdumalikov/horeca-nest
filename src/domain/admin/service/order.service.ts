import { Injectable } from '@nestjs/common';
import { AdminOrdersRepo } from '../repo/order.repo';
import { OrderUpdateDto, SetDeliverDto, SetDeliverMultipleDto, SetOrderStatusDto, SetOrderStatusMultipleDto, SetPaymentDto } from '../dto/product-admin.dto';
import { ICurrentUser } from 'src/shared/interface/list.interface';
import { OrderListByUsersDto, OrderListDto, SortType } from 'src/domain/orders/dto/order.dto';
import { OrderPaymentHistoryTypes, OrderStatus, PaidStatusFilterEnum, PaymentTypesEnum } from 'src/domain/orders/dto/order.enum';
import { AdminProductRepo } from '../repo/product.repo';
import { OrderAlreadyDeliveredException, PaymentPriceExceed, ProductNotFoundException } from 'src/errors/permission.error';
import { isEmpty } from 'lodash';
import { AdminOrderItemsRepo } from '../repo/order-item.repo';
import { AdminOrderPaymentHistoryRepo } from '../repo/order-payment-history.repo';
import { AdminUserRepo } from '../repo/user.repo';
import { krillToLatin, latinToKrill } from 'src/shared/utils/translate';

@Injectable()
export class AdminOrderService {
  constructor(
    private readonly adminOrderRepo: AdminOrdersRepo,
    private readonly adminProductRepo: AdminProductRepo,
    private readonly adminOrderItemRepo: AdminOrderItemsRepo,
    private readonly adminOrderPaymentHistoryRepo: AdminOrderPaymentHistoryRepo,
    private readonly adminUserRepo: AdminUserRepo,
  ) { }

  async setStatus(params: SetOrderStatusDto, currentUser: ICurrentUser) {
    const order = await this.adminOrderRepo.selectById(params.order_id);

    if (order.status === OrderStatus.DELIVERED && (![OrderStatus.PARTIALLY_PAID || OrderStatus.FULLY_PAID].includes(params.status))) {
      return { success: true };
    }

    return this.adminOrderRepo.knex.transaction(async (trx) => {
      await this.adminOrderRepo.updateByIdWithTransaction(trx, params.order_id, {
        status: params.status,
        registrator_id: currentUser.id,
        updated_by: currentUser.id
      });

      if (params.status === OrderStatus.REJECTED) {
        const order_items = await this.adminOrderRepo.knex
          .select(['product_id', 'quantity'])
          .from('order_items')
          .where('order_id', params.order_id)
          .where('is_deleted', false);

        for await (let item of order_items) {
          const product = await this.adminProductRepo.selectById(item.product_id);
          await this.adminProductRepo.updateByIdWithTransaction(
            trx,
            item.product_id,
            { product_count: Number(product.product_count) + Number(item.quantity) }
          );
        }
      }

      return { success: true };
    });
  }

  setStatusMultipeOrders(params: SetOrderStatusMultipleDto, currentUser: ICurrentUser) {
    return this.adminOrderRepo.knex.transaction(async (trx) => {
      await this.adminOrderRepo.updateByIdWithTransaction(trx, params.order_ids, {
        status: params.status,
        registrator_id: currentUser.id,
        updated_by: currentUser.id
      });

      if (params.status === OrderStatus.REJECTED) {
        const order_items = await this.adminOrderRepo.knex
          .select(['product_id', 'quantity'])
          .from('order_items')
          .where('order_id', params.order_ids[0])
          .where('is_deleted', false);

        for await (let item of order_items) {
          const product = await this.adminProductRepo.selectById(item.product_id);
          await this.adminProductRepo.updateByIdWithTransaction(
            trx,
            item.product_id,
            { product_count: Number(product.product_count) + Number(item.quantity) }
          );
        }
      }

      return { success: true };
    });
  }

  setDeliver(params: SetDeliverDto, currentUser: ICurrentUser) {
    return this.adminOrderRepo.knex.transaction(async (trx) => {
      const order = await this.adminOrderRepo.selectById(params.order_id);

      if (order.status === OrderStatus.DELIVERED) {
        throw new OrderAlreadyDeliveredException();
      }

      await this.adminOrderRepo.updateByIdWithTransaction(trx, params.order_id, {
        deliver_id: params.deliver_id,
        deliver_user_json: await trx
          .select(['first_name', 'last_name', 'role', 'phone'])
          .from('users')
          .where('id', params.deliver_id)
          .first(),
        updated_by: currentUser.id
      });

      return { success: true };
    });
  }

  setDeliverMultiple(params: SetDeliverMultipleDto, currentUser: ICurrentUser) {
    return this.adminOrderRepo.knex.transaction(async (trx) => {
      // const order = await this.adminOrderRepo.selectById(params.order_id);

      // if (order.status === OrderStatus.DELIVERED) {
      //   throw new OrderAlreadyDeliveredException();
      // }

      await this.adminOrderRepo.updateByIdWithTransaction(trx, params.order_ids, {
        deliver_id: params.deliver_id,
        deliver_user_json: await trx
          .select(['first_name', 'last_name', 'role', 'phone'])
          .from('users')
          .where('id', params.deliver_id)
          .first(),
        updated_by: currentUser.id
      });

      return { success: true };
    });
  }

  async setPayment(params: SetPaymentDto, currentUser: ICurrentUser) {
    return this.adminOrderRepo.knex.transaction(async (trx) => {
      const order = await this.adminOrderRepo.selectById(params.order_id);

      if (params.paid_price > order.total_sum || (order.paid + params.paid_price) > order.total_sum) {
        throw new PaymentPriceExceed();
      }

      if (order.payment_type === PaymentTypesEnum.DEBT) {
        await this.adminOrderPaymentHistoryRepo.insertWithTransaction(trx, {
          id: this.adminOrderPaymentHistoryRepo.generateRecordId(),
          user_id: order.user_id,
          // user_json: currentUser,
          receiver_id: currentUser.id,
          order_id: order.id,
          type: OrderPaymentHistoryTypes.PAYMENT,
          value: params.paid_price
        });

        await this.adminUserRepo.updateByIdWithTransaction(trx, order.user_id, {
          balance: trx.raw(`balance + ${params.paid_price}`)
        });
      }

      await this.adminOrderRepo.updateByIdWithTransaction(trx, params.order_id, {
        paid: order.paid + params.paid_price,
        updated_by: currentUser.id
      });

      return { success: true };
    })
  }

  async orderList(params: OrderListDto) {
    const knex = this.adminOrderRepo.knex;
    let query = knex
      .select([
        '*',
        knex.raw('count(id) over() as total'),
        knex.raw(`case
          when total_sum > paid and paid > 0 then 'Qisman tolangan'
          when paid = 0 then 'Tolanmagan'
          when total_sum = paid then 'Tolangan'
          else null
          end as paid_status
        `)])
      .from(this.adminOrderRepo._tableName)
      .orderBy('created_at', 'desc');

    if (params?.is_deleted === 'true') {
      query.where('is_deleted', true);
    }

    if (params?.is_deleted === 'false') {
      query.where('is_deleted', false);
    }

    if (params?.status) {
      query.where('status', params.status)
    }

    if (params.limit) {
      query.limit(Number(params.limit));
    }

    if (params.offset) {
      query.offset(Number(params.offset));
    }

    if (params?.created_at_order === 'asc') {
      query.orderBy('created_at', 'asc')
    }

    if (params?.created_at_order === 'desc') {
      query.orderBy('created_at', 'desc')
    }

    if (!isEmpty(params?.paid_status)) {
      switch (params.paid_status) {
        case PaidStatusFilterEnum.FULLY_PAID:
          query.whereRaw('paid >= total_sum');
          break;
        case PaidStatusFilterEnum.PARTIALLY_PAID:
          query.whereRaw('total_sum > paid and paid > 0');
          break;
        case PaidStatusFilterEnum.NOT_PAID:
          query.whereRaw('paid <= 0');
          break;
        default:
          break;
      }
    }

    if (!isEmpty(params?.client_name)) {
      const name_latin = krillToLatin(params.client_name).replace(/'/g, "''");
      const name_krill = latinToKrill(params.client_name);
      query = query.andWhere((builder) =>
        builder
          .orWhereRaw(`user_json ->> 'full_name' ilike %${name_latin}%`)
          .orWhereRaw(`user_json ->> 'full_name' ilike %${name_krill}%`)
      );
    }

    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
  }

  async orderListByUsers(params: OrderListByUsersDto) {
    const knex = this.adminOrderRepo.knex;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from(this.adminOrderRepo._tableName)
      .orderBy('created_at', 'desc');

    if (params?.user_id) {
      query.where('user_id', params.user_id)
    }

    if (params?.is_deleted === 'true') {
      query.where('is_deleted', true);
    }

    if (params?.is_deleted === 'false') {
      query.where('is_deleted', false);
    }

    if (params?.status) {
      query.where('status', params.status)
    }

    if (params.limit) {
      query.limit(Number(params.limit));
    }

    if (params.offset) {
      query.offset(Number(params.offset));
    }

    if (params?.sort === SortType.asc) {
      query.orderBy('created_at', 'asc')
    }

    if (params?.sort === SortType.desc) {
      query.orderBy('created_at', 'desc')
    }

    if (!isEmpty(params?.paid_status)) {
      switch (params.paid_status) {
        case PaidStatusFilterEnum.FULLY_PAID:
          query.whereRaw('paid >= total_sum');
          break;
        case PaidStatusFilterEnum.PARTIALLY_PAID:
          query.whereRaw('total_sum > paid and paid > 0');
          break;
        case PaidStatusFilterEnum.NOT_PAID:
          query.whereRaw('paid <= 0');
          break;
        default:
          break;
      }
    }

    if (!isEmpty(params?.client_name)) {
      const name_latin = krillToLatin(params.client_name).replace(/'/g, "''");
      const name_krill = latinToKrill(params.client_name);
      query = query.andWhere((builder) =>
        builder
          .orWhereRaw(`user_json ->> 'full_name' ilike %${name_latin}%`)
          .orWhereRaw(`user_json ->> 'full_name' ilike %${name_krill}%`)
      );
    }

    if (!isEmpty(params?.order_number)) {
      query.where('order_number', params.order_number);
    }

    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
  }

  async orderListByDeliver(params: OrderListByUsersDto, user) {
    const knex = this.adminOrderRepo.knex;
    let query = knex
      .select([
        'o.*',
        knex.raw(`
          json_agg(
            jsonb_build_object(
              'order_item_id', item.id,
              'name_uz', product.name_uz,
              'name_ru', product.name_ru,
              'quantity', item.quantity,
              'barcode', product.barcode,
              'image', product.image,
              'count_price', product.count_price,
              'discount_price', product.discount_price,
              'block_price', product.block_price,
              'count_in_block', product.count_in_block,
              'price_for_item', item.price
            )
          ) as order_items`),
        knex.raw('count(o.id) over() as total')
      ])
      .from('orders as o')
      .leftJoin('order_items as item', function () {
        this.on('item.order_id', 'o.id')
        // .andOn(knex.raw('item.is_deleted = false'))
      })
      .leftJoin('products as product', function () {
        this.on('product.id', 'item.product_id').andOn(knex.raw('product.is_deleted = false'))
      })
      .where('o.deliver_id', user.id)
      .orderBy('o.created_at', 'desc')
      .groupBy('o.id');

    if (params?.is_deleted === 'true') {
      query.where('o.is_deleted', true);
    }

    if (params?.is_deleted === 'false') {
      query.where('o.is_deleted', false);
    }

    if (params?.status) {
      query.where('o.status', params.status)
    }

    if (params.limit) {
      query.limit(Number(params.limit));
    }

    if (params.offset) {
      query.offset(Number(params.offset));
    }

    if (params?.sort === SortType.asc) {
      query.orderBy('o.created_at', 'asc')
    }

    if (params?.sort === SortType.desc) {
      query.orderBy('o.created_at', 'desc')
    }

    if (!isEmpty(params?.paid_status)) {
      switch (params.paid_status) {
        case PaidStatusFilterEnum.FULLY_PAID:
          query.whereRaw('o.paid >= o.total_sum');
          break;
        case PaidStatusFilterEnum.PARTIALLY_PAID:
          query.whereRaw('o.total_sum > o.paid and o.paid > 0');
          break;
        case PaidStatusFilterEnum.NOT_PAID:          
          query.whereRaw('o.paid <= 0');
          break;
        default:
          break;
      }
    }
    
    if (!isEmpty(params?.client_name)) {
      const name_latin = krillToLatin(params.client_name).replace(/'/g, "''");
      const name_krill = latinToKrill(params.client_name);

      query.andWhere((builder) =>
        builder
          .orWhereRaw(`"o".user_json ->> 'full_name' ilike %${name_latin}%`)
          .orWhereRaw(`"o".user_json ->> 'full_name' ilike %${name_krill}%`)
      );
    }

    if (!isEmpty(params?.order_number)) {
      query.where('o.order_number', params.order_number);
    }
    
    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
  }

  async findOne(id: string) {
    const knex = this.adminProductRepo.knex;

    const product = knex
      .select([
        'o.*',
        'user.first_name',
        'user.last_name',
        'user.phone',
        knex.raw(`
          json_agg(
            jsonb_build_object(
              'order_item_id', item.id,
              'name_uz', product.name_uz,
              'name_ru', product.name_ru,
              'quantity', item.quantity,
              'barcode', product.barcode,
              'image', product.image,
              'count_price', product.count_price,
              'discount_price', product.discount_price,
              'block_price', product.block_price,
              'count_in_block', product.count_in_block,
              'price_for_item', item.price
            )
          ) as order_items
        `)
      ])
      .from('orders as o')
      .leftJoin('order_items as item', function () {
        this.on('item.order_id', 'o.id')
        // .andOn(knex.raw('item.is_deleted = false'))
      })
      .leftJoin('products as product', function () {
        this.on('product.id', 'item.product_id').andOn(knex.raw('product.is_deleted = false'))
      })
      .leftJoin('users as user', function () {
        this.on('user.id', 'o.user_id').andOn(knex.raw('"user"."is_deleted" = false'))
      })
      .where('o.id', id)
      .where('o.is_deleted', false)
      .groupBy(['o.id', 'user.id'])
      .first();

    return product;
  }

  async updateOrder(order_id, params: OrderUpdateDto) {
    return this.adminOrderRepo.knex.transaction(async (trx) => {
      const order = await this.adminOrderRepo.selectById(order_id).where('is_deleted', false);

      if (order.status === OrderStatus.DELIVERED) {
        throw new OrderAlreadyDeliveredException();
      }

      let totalSumOfOrder = order.total_sum;

      for await (const item of params.items) {
        const order_item = await this.adminOrderItemRepo.selectById(item.order_item_id);

        totalSumOfOrder = totalSumOfOrder - order_item.price * order_item.quantity;

        const product = await this.adminProductRepo.selectById(order_item.product_id).where('is_deleted', false);
        if (isEmpty(order_item) || isEmpty(product)) {
          throw new ProductNotFoundException();
        }

        if (item.order_item_quantity === 0) {
          await this.adminOrderItemRepo.softDelete(item.order_item_id);
        }

        let priceForItem = product.discount_price ? product.discount_price : product.count_price;

        if (item.order_item_quantity >= product.count_in_block && +product.block_price < priceForItem) {
          priceForItem = +product.block_price;
        }

        await this.adminOrderItemRepo.updateByIdWithTransaction(trx, item.order_item_id,
          { quantity: item.order_item_quantity, price: priceForItem }
        );

        totalSumOfOrder += priceForItem * item.order_item_quantity;
      }

      const updatedOrder = await this.adminOrderRepo.updateByIdWithTransaction(
        trx,
        order_id,
        { total_sum: totalSumOfOrder }
      );

      return updatedOrder;
    })
  }
}
