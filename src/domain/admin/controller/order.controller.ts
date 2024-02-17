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
import { OrderListByUsersDto, OrderListDto } from 'src/domain/orders/dto/order.dto';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { ICurrentUser } from 'src/shared/interface/list.interface';

@ApiTags('Admin')
@ApiBearerAuth('authorization')
@UseGuards(AdminGuard)
@Controller('admin/order')
export class AdminOrderController {
  constructor(
    private readonly adminOrderService: AdminOrderService,
  ) { }

  @Post('set-status')
  async setStatus(@Body() params: SetOrderStatusDto, @CurrentUser() currentUser: ICurrentUser) {
    return this.adminOrderService.setStatus(params, currentUser);
  }

  @Get('list')
  async orderList(
    @Query() params: OrderListDto,
  ) {
    return this.adminOrderService.orderList(params);
  }

  @Get('list-by-user')
  async orderListByUsers(
    @Query() params: OrderListByUsersDto,
  ) {
    return this.adminOrderService.orderList(params);
  }
}
