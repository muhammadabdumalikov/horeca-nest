import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ConfirmOtpDto,
  CreateUserDto,
  UpdateUserDto,
  UserLoginDto,
} from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  signUp(@Body() params: CreateUserDto) {
    return this.userService.signUp(params);
  }

  @Post('confirm-otp')
  confirmOtp(@Body() params: ConfirmOtpDto) {
    return this.authService.confirmOtp(params);
  }

  @Post('login')
  login(@Body() params: UserLoginDto) {
    return this.authService.login(params);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
