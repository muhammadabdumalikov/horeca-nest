import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsISO8601, IsOptional, IsString } from "class-validator";
import { ListPageDto } from "src/shared/dto/list.dto";

export class GenerateFakturaReportDto {
  @ApiPropertyOptional()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  user_ids?: string[];

  @ApiProperty()
  @IsISO8601()
  from_date: string;

  @ApiProperty()
  @IsISO8601()
  to_date: string;
}

export class GenerateFakturaOrderReportDto {
  @ApiProperty()
  @IsString()
  order_id: string;
}

export class GenerateAktSverkaReportDto {
  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsISO8601()
  from_date: string;

  @ApiProperty()
  @IsISO8601()
  to_date: string;
}


export class FakturaReportListDto  extends ListPageDto{
  @ApiProperty()
  @IsISO8601()
  from_date: string;

  @ApiProperty()
  @IsISO8601()
  to_date: string;

  @ApiProperty()
  @IsString()
  is_archived: string;
}

export class SetFakturaReportArchiveDto {
  @ApiProperty()
  @IsString()
  order_id: string;
}