import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepo } from './orders.repo';
import { ProductRepo } from '../product/product.repo';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { OrderItemsRepo } from './oreder-items.repo';
import { OrderPaymentHistoryRepo } from './order-payment-history.repo';

@Module({
  imports: [UserModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepo, OrderItemsRepo, ProductRepo, JwtService, OrderPaymentHistoryRepo],
})
export class OrdersModule {}
