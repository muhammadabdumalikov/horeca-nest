import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, OrderListDto } from './dto/order.dto';
import { OrdersRepo } from './orders.repo';
import { ProductRepo } from '../product/product.repo';
import { ProductNotFoundException } from 'src/errors/permission.error';
// import { KnexService } from 'src/providers/knex.service';
import { IUser } from '../user/interface/user.interface';
import { isEmpty } from 'lodash';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepo: OrdersRepo,
    private readonly productRepo: ProductRepo, // private readonly knexService: KnexService,
  ) {}

  async createOrder(params: CreateOrderDto) {
    const orderedProductArray = [];

    for await (const value of params.products) {
      const product = await this.productRepo.selectById(value.product_id);

      if (!product) {
        throw new ProductNotFoundException();
      }

      orderedProductArray.push({
        seller_id: product.owner_id,
        product_id: value.product_id,
        client_data: {
          first_name: params.client_first_name,
          last_name: params.client_last_name,
          phone: params.client_phone,
        },
        count: value.count,
        price: product.sale_price * value.count,
      });
    }

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

    await this.orderRepo.batchInsert(orderedProductArray, {
      returning: ['*'],
      chunkSize: 500,
    });

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
