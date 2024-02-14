import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ListPageDto } from 'src/shared/dto/list.dto';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_uz: string;

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_ru: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }

export class AdminCategoryListPageDto extends ListPageDto{
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  is_deleted?: string;
}

export class SetCategoryStatusDto {
  @ApiProperty()
  @IsString()
  category_id: string;

  @ApiProperty()
  @IsString()
  is_deleted: string;
}
