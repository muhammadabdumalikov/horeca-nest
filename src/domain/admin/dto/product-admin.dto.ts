import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ProductStatusEnum } from '../enum/product.enum';
import { OrderStatus } from 'src/domain/orders/dto/order.enum';

export class SetProductStatusDto {
  @ApiProperty()
  @IsString()
  product_id: string;

  @ApiProperty()
  @IsEnum(ProductStatusEnum)
  status: ProductStatusEnum;
}

export class SetOrderStatusDto {
  @ApiProperty()
  @IsString()
  order_id: string;

  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
