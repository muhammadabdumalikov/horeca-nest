import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, OrderListDto } from './dto/order.dto';
import { OrdersRepo } from './orders.repo';
import { ProductRepo } from '../product/product.repo';
import { OnlySuperUserAllowedException, PaymentTypeNotAllowed, ProductCountLimitedException, ProductNotFoundException } from 'src/errors/permission.error';
// import { KnexService } from 'src/providers/knex.service';
import { IUser } from '../user/interface/user.interface';
import { isEmpty } from 'lodash';
import { IProduct } from '../product/interface/product.interface';
import { OrderPaymentHistoryTypes, OrderStatus, PaidStatusFilterEnum, PaymentTypesEnum } from './dto/order.enum';
import { OrderItemsRepo } from './oreder-items.repo';
import { generateOrderCode } from 'src/shared/utils/password-hash';
import { OrderPaymentHistoryRepo } from './order-payment-history.repo';
import { UserRepo } from '../user/user.repo';
import { krillToLatin, latinToKrill } from 'src/shared/utils/translate';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepo: OrdersRepo,
    private readonly orderItemsRepo: OrderItemsRepo,
    private readonly productRepo: ProductRepo,
    private readonly orderPaymentHistoryRepo: OrderPaymentHistoryRepo,
    private readonly userRepo: UserRepo,
  ) { }

  async createOrder(params: CreateOrderDto, currentUser: IUser) {
    return this.orderRepo.knex.transaction(async (trx) => {
      const paymentType = await trx.select('*')
        .from('payment_types')
        .where('id', params.payment_type)
        .where('is_deleted', false)
        .first();

      if (isEmpty(paymentType)) {
        throw new PaymentTypeNotAllowed();
      }

      if (params.payment_type === PaymentTypesEnum.DEBT) {
        if (!currentUser.super_user) {
          throw new OnlySuperUserAllowedException();
        }
      }

      delete currentUser.role;

      const [order] = await this.orderRepo.insertWithTransaction(trx, {
        id: this.orderRepo.generateRecordId(),
        user_id: currentUser.id,
        user_json: currentUser,
        status: OrderStatus.REGISTERED,
        quantity: params.items.length,
        // order_number: generateOrderCode(),
        comment: params?.comment,
        location: params.location,
        payment_type: params.payment_type,
        payment_type_name: {
          name_uz: paymentType.name_uz,
          name_ru: paymentType.name_ru
        }
      });

      let totalSumOfOrder = 0;

      for await (const item of params.items) {
        const product: IProduct = await this.productRepo.selectById(item.product_id);

        if (isEmpty(product)) {
          throw new ProductNotFoundException();
        }

        if (item.quantity > product.product_count) {
          throw new ProductCountLimitedException();
        }

        await this.productRepo.updateByIdWithTransaction(trx, item.product_id, { product_count: product.product_count - item.quantity });

        let priceForItem = product.discount_price > 0 ? product.discount_price : product.count_price;        

        if (item.quantity >= product.count_in_block && product.block_price > 0 && +product.block_price < priceForItem) {
          priceForItem = +product.block_price;
        }

        const order_item = await this.orderItemsRepo.insertWithTransaction(trx, {
          id: this.orderItemsRepo.generateRecordId(),
          order_id: order?.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_type: product.measure,
          price: priceForItem
        })

        totalSumOfOrder += priceForItem * item.quantity;
      }

      const updatedOrder = await this.orderRepo.updateByIdWithTransaction(trx, order.id, { total_sum: totalSumOfOrder });

      if (params.payment_type === PaymentTypesEnum.DEBT) {
        await this.orderPaymentHistoryRepo.insertWithTransaction(trx, {
          id: this.orderPaymentHistoryRepo.generateRecordId(),
          user_id: currentUser.id,
          user_json: currentUser,
          order_id: order.id,
          type: OrderPaymentHistoryTypes.DEBT,
          value: totalSumOfOrder
        });

        await this.userRepo.updateByIdWithTransaction(trx, currentUser.id, {
          balance: trx.raw(`balance - ${totalSumOfOrder}`)
        });
      }

      return updatedOrder;
    })

    // const dataForBatchInsert = params.products.map(async (value) => {
    //   const product = await this.productRepo.selectById(value.product_id);

    //   if (!product) {
    //     throw new ProductNotFoundException();
    //   }

    //   return {
    //     seller_id: product.owner_id,
    //     product_id: value.product_id,
    //     client_data: {
    //       first_name: params.client_first_name,
    //       last_name: params.client_last_name,
    //       phone: params.client_phone,
    //     },
    //     count: value.count,
    //     price: product.sale_price * value.count,
    //   };
    // });

    return { success: true };
  }

  async getMyOrdersList(params: OrderListDto, currentUser: IUser) {
    const knex = this.orderRepo.knex;
    let query = knex
      .select([
        knex.raw(`json_agg(
          jsonb_build_object(
            'name_uz', product.name_uz,
            'name_ru', product.name_ru,
            'price', product.count_price,
            'discount_price', product.discount_price,
            'price_for_item', item.price::int,
            'quantity', item.quantity,
            'image', product.image
          )
        ) as order_item`),
        knex.raw(`
          jsonb_build_object(
            'name_uz', pt.name_uz,
            'name_ru', pt.name_ru
          ) as payment_type`),
        'order.total_sum',
        'order.comment',
        'order.order_number',
        'order.created_at',
        'order.status',
        'order.paid',
        'order.location',
        knex.raw('count("order".id) over() as total'),
        knex.raw(`case
          when "order".total_sum > "order".paid and "order".paid > 0 then 'Qisman tolangan'
          when "order".paid = 0 then 'Tolanmagan'
          when "order".total_sum = paid then 'Tolangan'
          else null
          end as order_paid_status
        `)])
      .from(`${this.orderRepo._tableName} as order`)
      .innerJoin('order_items as item', function () {
        this.on('order.id', 'item.order_id')
      })
      .innerJoin('products as product', function () {
        this.on('product.id', 'item.product_id').andOn(knex.raw('product.is_deleted = false'))
      })
      .leftJoin('payment_types as pt', function () {
        this.on('order.payment_type', 'pt.id')
      })
      .where('order.user_id', currentUser.id)
      .where('order.is_deleted', false)
      .groupBy(['order.id', 'pt.name_uz', 'pt.name_ru'])
      .orderBy('order.created_at', 'desc');

    if (params.limit) {
      query = query.limit(Number(params.limit));
    }

    if (params.offset) {
      query = query.offset(Number(params.offset));
    }

    if (params?.created_at_order === 'asc') {
      query.orderBy('order.created_at', 'asc')
    }

    if (params?.created_at_order === 'desc') {
      query.orderBy('order.created_at', 'desc')
    }

    if (!isEmpty(params?.paid_status)) {
      switch (params.paid_status) {
        case PaidStatusFilterEnum.FULLY_PAID:
          query.whereRaw('"order".paid >= "order".total_sum');
          break;
        case PaidStatusFilterEnum.PARTIALLY_PAID:
          query.whereRaw('"order".total_sum > "order".paid and "order".paid > 0');
          break;
        case PaidStatusFilterEnum.NOT_PAID:
          query.whereRaw('"order".paid <= 0');
          break;
        default:
          break;
      }
    }

    if (!isEmpty(params?.order_number)) {
      query.where('order.order_number', params.order_number)
    }

    if (!isEmpty(params?.client_name)) {
      const name_latin = krillToLatin(params.client_name).replace(/'/g, "''");
      const name_krill = latinToKrill(params.client_name);
      query = query.andWhere((builder) =>
        builder
          .orWhereRaw(`"order".user_json ->> 'full_name' ilike '%${name_latin}%'`)
          .orWhereRaw(`"order".user_json ->> 'full_name' ilike '%${name_krill}%'`)
      );
    }

    if (!isEmpty(params?.order_number)) {
      query.where('order.order_number', params.order_number);
    }

    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
  }
}
