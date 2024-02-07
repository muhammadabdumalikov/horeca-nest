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
import { ListPageDto } from 'src/shared/dto/list.dto';
import { CreateWorkerDto } from '../dto/user-admin.dto';

@ApiTags('Admin')
// @ApiBasicAuth('basic')
// @UseGuards(RootGuard)
@Controller('root')
export class SuperAdminController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Post('create-worker')
  async createWorker(@Body() params: CreateWorkerDto) {
    return this.adminUserService.createworker(params);
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
