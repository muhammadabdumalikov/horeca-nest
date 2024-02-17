import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { SetOrderStatusDto } from '../dto/product-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guard/admin.guard';
import { AdminOrderService } from '../service/order.service';
import { OrderListDto } from 'src/domain/orders/dto/order.dto';

@ApiTags('Admin')
// @ApiBearerAuth('authorization')
// @UseGuards(AdminGuard)
@Controller('admin/order')
export class AdminOrderController {
  constructor(
    private readonly adminOrderService: AdminOrderService,
  ) { }

  @Post('set-status')
  async setStatus(@Body() params: SetOrderStatusDto) {
    return this.adminOrderService.setStatus(params);
  }

  @Get('list')
  async orderList(
    @Query() params: OrderListDto,
  ) {
    return this.adminOrderService.orderList(params);
  }
}
