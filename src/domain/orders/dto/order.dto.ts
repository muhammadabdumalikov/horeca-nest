import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { OrderStatus, PaymentType } from './order.enum';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { Type } from 'class-transformer';

class SingleOrderDto {
  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsString()
  product_id: string;
}

export class CreateOrderDto {
  @ApiProperty({ isArray: true, type: () => SingleOrderDto })
  @Type(() => SingleOrderDto)
  @ValidateNested({ each: true })
  items: SingleOrderDto[];

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  payment_type: PaymentType;
}

export class OrderListDto extends ListPageDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
