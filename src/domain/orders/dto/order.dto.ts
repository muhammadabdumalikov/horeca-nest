import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from './order.enum';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { Type } from 'class-transformer';

class SingleOrderDto {
  @ApiProperty()
  @IsNumber()
  count: number;

  @ApiProperty()
  @IsString()
  product_id: string;
}

export class CreateOrderDto {
  @ApiProperty({ isArray: true, type: () => SingleOrderDto })
  @Type(() => SingleOrderDto)
  @ValidateNested({ each: true })
  products: SingleOrderDto[];

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  client_first_name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  client_last_name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(12)
  client_phone: string;
}

export class OrderListDto extends ListPageDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
