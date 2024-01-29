import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { AdminUserService } from '../service/user.service';
import { RootGuard } from 'src/guard/root.guard';
import { CreateUserDto } from 'src/domain/user/dto/user.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';

@ApiTags('Admin')
@ApiBasicAuth('basic')
@UseGuards(RootGuard)
@Controller('root')
export class SuperAdminController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Post('create-superadmin')
  async createSuperAdmin(@Body() params: CreateUserDto) {
    return this.adminUserService.createSuperAdmin(params);
  }

  @Get('list')
  async list(@Query() params: ListPageDto) {
    return this.adminUserService.findAllAdmins(params);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminUserService.delete(id);
  }
}
