import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './domain/category/category.module';
import { UserModule } from './domain/user/user.module';
import { ProductModule } from './domain/product/product.module';
import { AdminModule } from './domain/admin/admin.module';
import { PoolService } from './providers/pool.service';
import { FileRouterModule } from './domain/file-router/file-router.module';
import { OrdersModule } from './domain/orders/orders.module';
import { CompanyModule } from './domain/company/company.module';
import { NotificationModule } from './domain/notification/notification.module';

@Module({
  imports: [
    CompanyModule,
    CategoryModule,
    UserModule,
    ProductModule,
    AdminModule,
    FileRouterModule,
    OrdersModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, PoolService],
})
export class AppModule {}
