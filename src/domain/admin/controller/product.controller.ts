import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AdminProductService } from '../service/product.service';
import { SetProductStatusDto } from '../dto/product-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guard/admin.guard';
import { ProductService } from 'src/domain/product/product.service';
import { OrderListDto } from 'src/domain/orders/dto/order.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';

@ApiTags('Admin')
@ApiBearerAuth('authorization')
@UseGuards(AdminGuard)
@Controller('admin/product')
export class AdminProductController {
  constructor(
    private readonly adminProductService: AdminProductService,
    private readonly productService: ProductService,
  ) {}

  @Post('set-status')
  async setStatus(@Body() params: SetProductStatusDto) {
    return this.adminProductService.setStatus(params);
  }

  @Get('list')
  async list(@Query() params: ListPageDto) {
    return this.adminProductService.findAll(params);
  }

  @Get('order-list')
  async orderList(@Query() params: OrderListDto) {
    return this.adminProductService.orderList(params);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminProductService.delete(id);
  }
}
