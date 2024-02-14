import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateCompanyDto, UpdateCompanyDto } from 'src/domain/company/dto/company.dto';
import { CompanyService } from 'src/domain/company/company.service';
import { GetCompanyListDto, SetCompanyStatusDto } from '../dto/company.admin.dto';
import { AdminCategoryListPageDto } from '../dto/category-admin.dto';

@ApiTags('Admin')
@Controller('admin/company')
export class AdminCompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Post()
  create(@Body() params: CreateCompanyDto) {
    return this.companyService.create(params);
  }

  @Get('all')
  getAllCompanies(@Query() params: AdminCategoryListPageDto) {
    return this.companyService.findAll(params);
  }

  @Post('set-status')
  async setStatus(@Body() params: SetCompanyStatusDto) {
    return this.companyService.setStatus(params);
  }

  @Get(':id')
  getCompanyById(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.companyService.delete(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() params: UpdateCompanyDto) {
    return this.companyService.update(id, params);
  }
}
