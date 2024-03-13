import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guard/admin.guard';
import { AdminUserService } from '../service/user.service';
import { UserService } from 'src/domain/user/user.service';
import { AdminUsersListDto, SetSuperUserDto, SetUserStatusDto } from '../dto/user-admin.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';

@ApiTags('Admin')
@ApiBearerAuth('authorization')
@UseGuards(AdminGuard)
@Controller('admin/users')
export class AdminUserController {
  constructor(
    private readonly adminUserService: AdminUserService,
    private readonly userService: UserService,
  ) {}

  @Post('set-status')
  async setStatus(@Body() params: SetUserStatusDto) {
    return this.adminUserService.setStatus(params);
  }

  @Post('set-super-user')
  async setSuperUser(@Body() params: SetSuperUserDto) {
    return this.adminUserService.setSuperUser(params);
  }

  @Get('list')
  async list(@Query() params: AdminUsersListDto) {
    return this.adminUserService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminUserService.delete(id);
  }
}