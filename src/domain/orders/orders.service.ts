import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, OrderListDto } from './dto/order.dto';
import { OrdersRepo } from './orders.repo';
import { ProductRepo } from '../product/product.repo';
import { ProductNotFoundException } from 'src/errors/permission.error';
// import { KnexService } from 'src/providers/knex.service';
import { IUser } from '../user/interface/user.interface';
import { isEmpty } from 'lodash';
import { IProduct } from '../product/interface/product.interface';
import { OrderStatus, PaymentType } from './dto/order.enum';
import { OrderItemsRepo } from './oreder-items.repo';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepo: OrdersRepo,
    private readonly orderItemsRepo: OrderItemsRepo,
    private readonly productRepo: ProductRepo, // private readonly knexService: KnexService,
  ) { }

  async createOrder(params: CreateOrderDto, currentUser: IUser) {
    return this.orderRepo.knex.transaction(async (trx) => {
      const order = await this.orderRepo.insert({
        user_id: currentUser.id,
        status: OrderStatus.REGISTERED,
        quantity: params.items.length,
        payment_type: params.payment_type,
      });

      let totalSumOfOrder = 0;

      for await (const item of params.items) {
        const product: IProduct = await this.productRepo.selectById(item.product_id);

        if (isEmpty(product)) {
          throw new ProductNotFoundException();
        }

        let priceForItem = product.discount_price ? product.discount_price : product.count_price;

        if (item.quantity >= product.count_in_block && +product.block_price < priceForItem) {
          priceForItem = +product.block_price;
        }
        
        const order_item = await this.orderItemsRepo.insertWithTransaction(trx, {
          id: this.orderItemsRepo.generateRecordId(),
          order_id: order[0]?.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_type: product.measure,
          price: priceForItem
        })

        totalSumOfOrder += priceForItem * item.quantity;
      }

      const updatedOrder = await this.orderRepo.updateById(order[0]?.id, { total_sum: totalSumOfOrder })
      
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

  async orderList(params: OrderListDto, currentUser: IUser) {
    return await this.orderRepo.select(
      {
        seller_id: currentUser.id,
        status: Number(params.status),
        is_deleted: false,
      },
      {
        limit: params.limit,
        offset: params.offset,
        order_by: { column: 'created_at', order: 'desc', use: true },
      },
    );
  }

  async deleteFromList(id: string, currentUser: IUser) {
    const order = await this.orderRepo.select({
      id: id,
      seller_id: currentUser.id,
      is_deleted: false,
    });

    if (isEmpty(order)) {
      throw new NotFoundException('Order not found!');
    }

    await this.orderRepo.update(
      {
        id: id,
        seller_id: currentUser.id,
      },
      {
        is_deleted: true,
      },
    );

    return { success: true };
  }
}
