import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePaymentTypeDto {  
  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_uz: string;

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  name_ru: string;
}

export class UpdatePaymentTypeDto extends PartialType(CreatePaymentTypeDto) { 
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_deleted: boolean;
}
