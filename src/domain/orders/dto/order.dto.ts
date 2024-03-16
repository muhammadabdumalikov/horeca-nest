import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from './order.enum';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { Type } from 'class-transformer';

export enum SortType {
  asc = 'asc',
  desc = 'desc'
}

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
  @IsArray()
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

  @ApiPropertyOptional({enum: SortType})
  @IsOptional()
  @IsEnum(SortType)
  sort?: SortType;
}

export class OrderListByUsersDto extends OrderListDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  user_id?: string;
}
