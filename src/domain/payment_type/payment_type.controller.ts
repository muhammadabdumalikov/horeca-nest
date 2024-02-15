import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentTypeService } from './payment_type.service';
import { CreatePaymentTypeDto, UpdatePaymentTypeDto } from './dto/create-payment-type.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';

@Controller('payment-type')
export class PaymentTypeController {
  constructor(private readonly paymentTypeService: PaymentTypeService) { }

  @Post()
  create(@Body() createNotificationDto: CreatePaymentTypeDto) {
    return this.paymentTypeService.create(createNotificationDto);
  }

  @Get('list')
  findAll(@Param() params: ListPageDto) {
    return this.paymentTypeService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdatePaymentTypeDto) {
    return this.paymentTypeService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentTypeService.delete(id);
  }
}
