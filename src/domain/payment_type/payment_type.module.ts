import { Module } from '@nestjs/common';
import { PaymentTypeService } from './payment_type.service';
import { PaymentTypeController } from './payment_type.controller';
import { PaymentTypeRepo } from './payment_type.repo';

@Module({
  controllers: [PaymentTypeController],
  providers: [PaymentTypeService, PaymentTypeRepo],
})
export class PaymentTypeModule { }
