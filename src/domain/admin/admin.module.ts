import { Module } from '@nestjs/common';
import { AdminProductService } from './service/product.service';
import { AdminCategoryController } from './controller/category.controller';
import { AdminProductController } from './controller/product.controller';
import { AdminCategoryService } from './service/category.service';
import { AdminCategoryRepo } from './repo/category.repo';
import { AdminProductRepo } from './repo/product.repo';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { ProductModule } from '../product/product.module';
import { AdminUserService } from './service/user.service';
import { AdminUserRepo } from './repo/user.repo';
import { AdminUserController } from './controller/user.controller';
import { OrdersRepo } from '../orders/orders.repo';
import { AdminAdvertisementController } from './controller/ads.controller';
import { AdminAdvertisementService } from './service/ads.service';
import { AdminAdvertisementRepo } from './repo/ads.repo';
import { SuperAdminController } from './controller/super-admin.controller';

@Module({
  imports: [UserModule, ProductModule],
  controllers: [
    SuperAdminController,
    AdminCategoryController,
    AdminProductController,
    AdminUserController,
    AdminAdvertisementController,
  ],
  providers: [
    AdminCategoryService,
    AdminProductService,
    AdminCategoryRepo,
    AdminProductRepo,
    AdminUserService,
    AdminUserRepo,
    JwtService,
    OrdersRepo,
    AdminAdvertisementService,
    AdminAdvertisementRepo,
  ],
})
export class AdminModule {}
