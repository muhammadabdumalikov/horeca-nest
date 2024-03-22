import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { SortType } from 'src/domain/orders/dto/order.dto';

export class ListPageDto {
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  created_at_order?: SortType.asc | SortType.desc;
}
