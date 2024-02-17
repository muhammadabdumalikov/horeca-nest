import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProductStatusEnum, UserRolesShort } from '../enum/product.enum';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { UserRoles } from 'src/domain/user/enum/user.enum';

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

export class AdminUsersListDto extends ListPageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  is_deleted?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({enum: UserRoles})
  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles;
}