import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ProductStatusEnum } from '../enum/product.enum';

export class SetUserStatusDto {
  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsEnum(ProductStatusEnum)
  status: ProductStatusEnum;
}
