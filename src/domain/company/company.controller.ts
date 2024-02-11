import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { ListPageDto } from 'src/shared/dto/list.dto';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }
  
  @Get('all')
  getAll(@Query() params: ListPageDto) {
    return this.companyService.findAll(params);
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }
}
