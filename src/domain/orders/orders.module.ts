import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepo } from './orders.repo';
import { ProductRepo } from '../product/product.repo';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepo, ProductRepo, JwtService],
})
export class OrdersModule {}
