import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserRolesShort } from '../enum/product.enum';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { PersonType, UserRolesAsString } from 'src/domain/user/enum/user.enum';

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

export class SetSuperUserDto {
  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsString()
  super_user: string;
}


export class CreateWorkerDto {
  @ApiProperty()
  @IsString()
  @MaxLength(12)
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

export class CreateProviderDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiPropertyOptional({ enum: PersonType })
  @IsEnum(PersonType)
  @IsOptional()
  person_type?: PersonType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  legal_name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  additional_name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;
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

  @ApiPropertyOptional({ enum: UserRolesAsString })
  @IsEnum(UserRolesAsString)
  @IsOptional()
  role?: UserRolesAsString;
}