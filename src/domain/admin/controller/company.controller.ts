import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto, UpdateCompanyDto } from 'src/domain/company/dto/company.dto';
import { CompanyService } from 'src/domain/company/company.service';
import { GetCompanyListDto, SetCompanyStatusDto } from '../dto/company.admin.dto';
import { AdminCategoryListPageDto } from '../dto/category-admin.dto';
import { AdminGuard } from 'src/guard/admin.guard';

@ApiTags('Admin')
@Controller('admin/company')
export class AdminCompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Post()
  create(@Body() params: CreateCompanyDto) {
    return this.companyService.create(params);
  }

  @Get('list')
  getAllCompanies(@Query() params: AdminCategoryListPageDto) {
    return this.companyService.findAll(params);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Post('set-status')
  async setStatus(@Body() params: SetCompanyStatusDto) {
    return this.companyService.setStatus(params);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Get(':id')
  getCompanyById(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.companyService.delete(id);
  }

  @ApiBearerAuth('authorization')
  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() params: UpdateCompanyDto) {
    return this.companyService.update(id, params);
  }
}
