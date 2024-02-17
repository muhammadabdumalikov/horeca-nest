import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { AdminCategoryService } from '../service/category.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guard/admin.guard';
import {
  AdminCategoryListPageDto,
  CreateCategoryDto,
  SetCategoryStatusDto,
  UpdateCategoryDto,
} from 'src/domain/admin/dto/category-admin.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';

@ApiTags('Admin')
// @UseGuards(AdminGuard)
// @ApiBearerAuth('authorization')
@Controller('admin/category')
export class AdminCategoryController {
  constructor(private readonly adminCategoryService: AdminCategoryService) {}

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Post()
  create(@Body() params: CreateCategoryDto) {
    return this.adminCategoryService.create(params);
  }

  @Get('list')
  getAllCategories(@Query() params: AdminCategoryListPageDto) {
    return this.adminCategoryService.findAll(params);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Post('set-status')
  async setStatus(@Body() params: SetCategoryStatusDto) {
    return this.adminCategoryService.setStatus(params);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() params: UpdateCategoryDto) {
    return this.adminCategoryService.update(id, params);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminCategoryService.delete(id);
  }
}
