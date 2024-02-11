import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { PersonType } from '../enum/user.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
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
  phone: string;

  @ApiProperty()
  @IsString()
  otp: string;
}

export class UserLoginDto {
  @ApiProperty()
  @IsString()
  phone: string;
}
