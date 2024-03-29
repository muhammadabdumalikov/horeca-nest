import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrderListDto } from './dto/order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IUser } from '../user/interface/user.interface';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { ListPageDto } from 'src/shared/dto/list.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth('authorization')
  @Post()
  async createOrder(@Body() params: CreateOrderDto, @CurrentUser() currentUser: IUser,
) {
    return this.ordersService.createOrder(params, currentUser);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('authorization')
  @Get('my')
  async getMyOrdersList(
    @Query() params: OrderListDto,
    @CurrentUser() currentUser: IUser,
  ) {
    return this.ordersService.getMyOrdersList(params, currentUser);
  }
}
