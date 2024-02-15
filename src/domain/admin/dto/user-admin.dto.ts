import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ProductStatusEnum, UserRolesShort } from '../enum/product.enum';

export class SetUserStatusDto {
  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsString()
  is_deleted: string;

  @ApiProperty()
  @IsString()
  is_block: string;
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

  @ApiProperty()
  @IsString()
  login: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ enum: UserRolesShort })
  @IsEnum(UserRolesShort)
  role: UserRolesShort
}

export class UpdateWorkerDto extends PartialType(CreateWorkerDto) { }

export class AdminLoginDto {
  @ApiProperty()
  @IsString()
  login: string;

  @ApiProperty()
  @IsString()
  password: string;
}