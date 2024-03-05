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
import { AdminAdvertisementService } from './service/ads.service';
import { AdminAdvertisementRepo } from './repo/ads.repo';
import { SuperAdminController } from './controller/super-admin.controller';
import { CompanyRepo } from '../company/company.repo';
import { CompanyService } from '../company/company.service';
import { AdminOrderController } from './controller/order.controller';
import { AdminOrderService } from './service/order.service';
import { AdminOrdersRepo } from './repo/order.repo';
import { AdminCompanyController } from './controller/company.controller';
import { AdminOrderItemsRepo } from './repo/order-item.repo';
import { ReportService } from './service/report.service';
import { ReportController } from './controller/report.controller';

@Module({
  imports: [UserModule, ProductModule],
  controllers: [
    SuperAdminController,
    AdminCategoryController,
    AdminProductController,
    AdminUserController,
    AdminOrderController,
    AdminCompanyController,
    ReportController
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
    CompanyService,
    CompanyRepo,
    AdminOrderService,
    AdminOrdersRepo,
    AdminOrderItemsRepo,

    ReportService
  ],
})
export class AdminModule {}
