import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

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