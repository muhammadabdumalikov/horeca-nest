import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateCompanyDto } from 'src/domain/company/dto/company.dto';
import { CompanyService } from 'src/domain/company/company.service';
import { GetCompanyListDto } from '../dto/company.admin.dto';

@ApiTags('Company')
@Controller('admin/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Post()
  create(@Body() params: CreateCompanyDto) {
    return this.companyService.create(params);
  }

  @Get('all')
  getAll(@Query() params: GetCompanyListDto) {
    return this.companyService.findAll(params);
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }
}
