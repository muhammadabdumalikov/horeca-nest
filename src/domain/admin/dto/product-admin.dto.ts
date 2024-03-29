import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ProductStatusEnum } from '../enum/product.enum';
import { OrderStatus } from 'src/domain/orders/dto/order.enum';
import { Type } from 'class-transformer';

export class SetProductStatusDto {
  @ApiProperty()
  @IsString()
  product_id: string;

  @ApiProperty()
  @IsString()
  is_deleted: string;
}

export class SetOrderStatusDto {
  @ApiProperty()
  @IsString()
  order_id: string;

  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class SetOrderStatusMultipleDto {
  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  order_ids: string[];

  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class SetDeliverDto {
  @ApiProperty()
  @IsString()
  order_id: string;

  @ApiProperty()
  @IsString()
  deliver_id: string;
}

export class SetDeliverMultipleDto {
  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  order_ids: string[];

  @ApiProperty()
  @IsString()
  deliver_id: string;
}

class OrderItemDetailDto {
  @ApiProperty()
  @IsString()
  order_item_id: string;

  @ApiProperty()
  @IsNumber()
  order_item_quantity: number;
}

export class OrderUpdateDto {
  @ApiProperty({ isArray: true, type: () => OrderItemDetailDto })
  @Type(() => OrderItemDetailDto)
  @ValidateNested({ each: true })
  @IsArray()
  items: OrderItemDetailDto[]
}

export class SetPaymentDto {
  @ApiProperty()
  @IsString()
  order_id: string;

  @ApiProperty()
  @IsNumber()
  paid_price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  payment_type_id?: string;
}
