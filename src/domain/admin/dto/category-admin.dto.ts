import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
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
  @IsOptional()
  parent_id?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }
