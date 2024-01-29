import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { SortType } from '../enum/product.enum';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_uz: string;

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_lat: string;

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_ru: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty()
  @IsString()
  category_id: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  sale_price?: number;

  @ApiProperty()
  @IsNumber()
  count: number;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  characteristic?: object;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductListByCategoryDto extends ListPageDto {
  @ApiProperty()
  @IsString()
  category_id: string;

  @ApiPropertyOptional({ enum: SortType })
  @IsEnum(SortType)
  @IsOptional()
  sort?: SortType;

  @ApiPropertyOptional()
  // @IsNumber()
  @IsOptional()
  from_price?: number;

  @ApiPropertyOptional()
  // @IsNumber()
  @IsOptional()
  to_price?: number;
}

export class SearchDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
}
