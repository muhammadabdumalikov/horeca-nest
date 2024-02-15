import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { MeasureType, SortType } from '../enum/product.enum';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  company_id: string;

  @ApiProperty()
  @IsString()
  category_id: string;

  @ApiProperty()
  @IsString()
  @MaxLength(128)
  name_uz: string;

  @ApiProperty()
  @IsString()
  @MaxLength(128)
  name_ru: string;

  @ApiPropertyOptional({ enum: MeasureType })
  @IsOptional()
  @IsEnum(MeasureType)
  measure?: MeasureType;

  @ApiProperty()
  @IsString()
  @MaxLength(24)
  barcode: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsNumber()
  count_in_block: number;

  @ApiProperty()
  @IsNumber()
  product_count: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(512)
  description?: string;

  @ApiProperty()
  @IsNumber()
  count_price: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  discount_price?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  block_price?: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductListByCategoryDto extends ListPageDto {
  @ApiProperty()
  @IsString()
  category_id: string;

  // @ApiPropertyOptional({ enum: SortType })
  // @IsEnum(SortType)
  // @IsOptional()
  // sort?: SortType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  company_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  is_deleted?: 'true' | 'false';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  date_order?: 'desc' | 'asc';
}

export class ProductListDto extends ListPageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category_id?: string;

  // @ApiPropertyOptional({ enum: SortType })
  // @IsEnum(SortType)
  // @IsOptional()
  // sort?: SortType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  company_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  is_deleted?: 'true' | 'false';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  date_order?: 'desc' | 'asc';
}

export class SearchDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}
