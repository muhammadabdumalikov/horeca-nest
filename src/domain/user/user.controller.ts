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
  AddHomeOtpDto,
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

  @ApiBearerAuth('authorization')
  @UseGuards(AuthGuard)
  @Patch('update-profile')
  update(@Body() updateUserDto: UpdateUserDto, @CurrentUser() user: IUser) {
    return this.userService.update(user, updateUserDto);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AuthGuard)
  @Post('add-home')
  addHome(@Body() updateUserDto, @CurrentUser() user: IUser) {
    return this.userService.addHome(user, updateUserDto);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AuthGuard)
  @Get('get-home')
  getHome(@CurrentUser() user: IUser) {
    return this.userService.getUserHome(user);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AuthGuard)
  @Delete('delete-profile')
  async delete(@CurrentUser() user: IUser) {
    return this.userService.delete(user.id);
  }
}
