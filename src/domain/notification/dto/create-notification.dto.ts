import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ListPageDto } from 'src/shared/dto/list.dto';

export class CreateNotificationDto {  
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  body?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  link?: string;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) { }

export class NotificationListDto extends ListPageDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  is_deleted?: string;
}