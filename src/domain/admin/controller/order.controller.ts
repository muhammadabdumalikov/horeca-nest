import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SetOrderStatusDto } from '../dto/product-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guard/admin.guard';
import { AdminOrderService } from '../service/order.service';

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
}
