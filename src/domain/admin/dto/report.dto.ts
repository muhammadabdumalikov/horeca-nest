import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsISO8601, IsOptional, IsString } from "class-validator";

export class GenerateFakturaReportDto {
  @ApiPropertyOptional()
  @IsString()
  @IsArray({ each: true })
  @IsOptional()
  user_ids?: string[];

  @ApiProperty()
  @IsISO8601()
  from_date: string;

  @ApiProperty()
  @IsISO8601()
  to_date: string;
}