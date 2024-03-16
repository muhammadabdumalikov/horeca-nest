import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";
import { ListPageDto } from "src/shared/dto/list.dto";

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  @MaxLength(128)
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(128)
  country_uz: string;

  @ApiProperty()
  @IsString()
  @MaxLength(128)
  country_ru: string;
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_deleted?: boolean;
}