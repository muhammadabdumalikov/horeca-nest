import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
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

class LocationDto {
  @ApiProperty()
  @IsString()
  lat: string;

  @ApiProperty()
  @IsString()
  long: string;
}

export class CreateOrderDto {
  @ApiProperty({ isArray: true, type: () => SingleOrderDto })
  @Type(() => SingleOrderDto)
  @ValidateNested({ each: true })
  items: SingleOrderDto[];

  @ApiProperty()
  @IsString()
  payment_type: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ type: () => LocationDto })
  @Type(() => LocationDto)
  @ValidateNested({ each: true })
  location: LocationDto;
}

export class OrderListDto extends ListPageDto {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  is_deleted?: string;
}

export class OrderListByUsersDto extends OrderListDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  user_id?: string;
}
