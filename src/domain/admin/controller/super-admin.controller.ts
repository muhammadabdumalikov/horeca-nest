import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { AdminUserService } from '../service/user.service';
import { AdminLoginDto, AdminUsersListDto, CreateWorkerDto, UpdateWorkerDto } from '../dto/user-admin.dto';

@ApiTags('Admin')
// @ApiBasicAuth('basic')
// @UseGuards(RootGuard)
@Controller('root')
export class SuperAdminController {
  constructor(private readonly adminUserService: AdminUserService) { }

  @Post('create-worker')
  async createWorker(@Body() params: CreateWorkerDto) {
    return this.adminUserService.createworker(params);
  }

  @Patch('update-worker/:id')
  update(@Param('id') id: string, @Body() updateWorkerDto: UpdateWorkerDto) {
    return this.adminUserService.updateWorker(id, updateWorkerDto);
  }

  @Post('login')
  async adminLogin(@Body() params: AdminLoginDto) {
    return this.adminUserService.adminLogin(params);
  }

  @Get('worker-list')
  async list(@Query() params: AdminUsersListDto) {
    return this.adminUserService.findAllAdmins(params);
  }

  @Delete('delete-worker/:id')
  async delete(@Param('id') id: string) {
    return this.adminUserService.delete(id);
  }
}
