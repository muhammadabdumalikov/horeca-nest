import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ConfirmOtpDto,
  CreateUserDto,
  UpdateUserDto,
  UserLoginDto,
} from './dto/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { IUser } from './interface/user.interface';

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

  @UseGuards(AuthGuard)
  @ApiBearerAuth('authorization')
  @Get('profile')
  getOwnProfile(@CurrentUser() currentUser: IUser) {
    return this.userService.getOwnProfile(currentUser);
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
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
