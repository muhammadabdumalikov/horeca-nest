import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportService } from '../service/report.service';
import { FakturaReportListDto, GenerateAktSverkaReportDto, GenerateFakturaReportDto, SetFakturaReportArchiveDto } from '../dto/report.dto';
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

  @Post('faktura-list')
  async fakturaReportList(@Body() params: FakturaReportListDto) {
    return this.reportService.fakturaReportList(params);
  }

  @Post('set-faktura-archive')
  async setFakturaArchive(@Body() params: SetFakturaReportArchiveDto) {
    return this.reportService.setFakturaReportArchive(params);
  }

  @Post('get-faktura-order')
  async getFakturaOrder(@Body() params: GenerateFakturaReportDto) {
    return this.reportService.getFakturaReport(params);
  }
}