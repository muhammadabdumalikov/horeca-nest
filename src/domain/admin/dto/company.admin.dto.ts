import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";
import { ListPageDto } from "src/shared/dto/list.dto";

export class GetCompanyListDto extends ListPageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  is_deleted?: 'true' | 'false';
}