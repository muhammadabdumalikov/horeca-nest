import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { PersonType } from '../enum/user.enum';
import { NamedLocationDto } from 'src/domain/orders/dto/order.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(12)
  phone: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiPropertyOptional({enum: PersonType})
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

export class ConfirmOtpDto {
  @ApiProperty()
  @IsString()
  @MaxLength(12)
  phone: string;

  @ApiProperty()
  @IsString()
  otp: string;
}

export class UserLoginDto {
  @ApiProperty()
  @IsString()
  @MaxLength(12)
  phone: string;
}


export class AddHomeOtpDto {
  @ApiProperty({ type: () => NamedLocationDto })
  @Type(() => NamedLocationDto)
  @ValidateNested({ each: true })
  location: NamedLocationDto;
}
