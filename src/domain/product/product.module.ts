import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepo } from './product.repo';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepo, JwtService],
  exports: [ProductService, ProductRepo],
})
export class ProductModule {}
