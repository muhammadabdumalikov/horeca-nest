import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  phone: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) { }

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
