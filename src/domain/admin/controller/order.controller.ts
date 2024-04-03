import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { OrderUpdateDto, SetDeliverDto, SetDeliverMultipleDto, SetOrderStatusDto, SetOrderStatusMultipleDto, SetPaymentDto } from '../dto/product-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guard/admin.guard';
import { AdminOrderService } from '../service/order.service';
import { OrderListByUsersDto, OrderListDto, OrderPaymentHistoryListDto } from 'src/domain/orders/dto/order.dto';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { ICurrentUser } from 'src/shared/interface/list.interface';
import { DeliveryGuard } from 'src/guard/delivery.guard';

@ApiTags('Admin')
@Controller('admin/order')
export class AdminOrderController {
  constructor(
    private readonly adminOrderService: AdminOrderService,
  ) { }

  @ApiBearerAuth('authorization')
  @UseGuards(DeliveryGuard)
  @Post('set-status')
  async setStatus(@Body() params: SetOrderStatusDto, @CurrentUser() currentUser: ICurrentUser) {
    return this.adminOrderService.setStatus(params, currentUser);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Post('set-status-multiple')
  async setStatusMultiple(@Body() params: SetOrderStatusMultipleDto, @CurrentUser() currentUser: ICurrentUser) {
    return this.adminOrderService.setStatusMultipeOrders(params, currentUser);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Post('set-deliver')
  async setDeliver(@Body() params: SetDeliverDto, @CurrentUser() currentUser: ICurrentUser) {
    return this.adminOrderService.setDeliver(params, currentUser);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Post('set-deliver-multiple')
  async setDeliverMultiple(@Body() params: SetDeliverMultipleDto, @CurrentUser() currentUser: ICurrentUser) {
    return this.adminOrderService.setDeliverMultiple(params, currentUser);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(DeliveryGuard)
  @Post('set-payment')
  async setPayment(@Body() params: SetPaymentDto, @CurrentUser() currentUser: ICurrentUser) {
    return this.adminOrderService.setPayment(params, currentUser);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Get('list')
  async orderList(
    @Query() params: OrderListDto,
  ) {
    return this.adminOrderService.orderList(params);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Get('payment-history-list')
  async orderPaymentHistory(
    @Query() params: OrderPaymentHistoryListDto,
  ) {
    return this.adminOrderService.orderPaymentHistoryList(params);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Get('list-by-user')
  async orderListByUsers(
    @Query() params: OrderListByUsersDto,
  ) {
    return this.adminOrderService.orderListByUsers(params);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(DeliveryGuard)
  @Get('list-by-deliver')
  async orderListByDeliver(
    @Query() params: OrderListByUsersDto,
    @CurrentUser() user
  ) {
    return this.adminOrderService.orderListByDeliver(params, user);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(DeliveryGuard)
  @Patch('order-update/:id')
  async orderUpdate(@Param('id') order_id: string, @Body() params: OrderUpdateDto) {
    return this.adminOrderService.updateOrder(order_id, params);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(DeliveryGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminOrderService.findOne(id);
  }
}
