import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { ListPageDto } from "src/shared/dto/list.dto";

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  @MaxLength(128)
  name_uz: string;

  @ApiProperty()
  @IsString()
  @MaxLength(128)
  name_ru: string;

  @ApiProperty()
  @IsString()
  @MaxLength(128)
  country_uz: string;

  @ApiProperty()
  @IsString()
  @MaxLength(128)
  country_ru: string;
}