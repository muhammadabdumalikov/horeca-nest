import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ProductStatusEnum, UserRolesShort } from '../enum/product.enum';

export class SetUserStatusDto {
  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsEnum(ProductStatusEnum)
  status: ProductStatusEnum;
}


export class CreateWorkerDto {
  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;

  @ApiProperty({ enum: UserRolesShort })
  @IsEnum(UserRolesShort)
  role: UserRolesShort
}

export class UpdateWorkerDto extends PartialType(CreateWorkerDto){}