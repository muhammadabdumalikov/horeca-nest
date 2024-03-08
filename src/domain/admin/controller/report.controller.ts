import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportService } from '../service/report.service';
import { GenerateAktSverkaReportDto, GenerateFakturaReportDto } from '../dto/report.dto';
import { AdminGuard } from 'src/guard/admin.guard';

@ApiTags('Admin')
@ApiBearerAuth('authorization')
@UseGuards(AdminGuard)
@Controller('admin/report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
  ) { }

  @Post('get-faktura-report')
  async getFakturaReport(@Body() params: GenerateFakturaReportDto) {
    return this.reportService.getFakturaReport(params);
  }

  @Post('get-akt-sverka')
  async getAktSverkaReport(@Body() params: GenerateAktSverkaReportDto) {
    return this.reportService.getActSverkaReport(params);
  }
}