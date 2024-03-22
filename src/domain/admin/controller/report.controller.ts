import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportService } from '../service/report.service';
import { FakturaReportListDto, GenerateAktSverkaReportDto, GenerateFakturaOrderReportDto, GenerateFakturaReportDto, SetFakturaReportArchiveDto } from '../dto/report.dto';
import { AdminGuard } from 'src/guard/admin.guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';

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

  @Get('faktura-list')
  async fakturaReportList(@Query() params: FakturaReportListDto) {
    return this.reportService.fakturaReportList(params);
  }

  @Post('set-faktura-archive')
  async setFakturaArchive(@Body() params: SetFakturaReportArchiveDto) {
    return this.reportService.setFakturaReportArchive(params);
  }

  @Post('get-faktura-order')
  async getFakturaOrder(@Body() params: GenerateFakturaOrderReportDto) {
    return this.reportService.getFakturaOrder(params);
  }

  @Get('get-all-products-excel-data')
  async getAllProductListForExcel() {
    return this.reportService.getAllProductsListForExcel();
  }

  @Post('get-all-itog-orders')
  async getTotalOrdersReport(@Body() params: GenerateFakturaOrderReportDto, @CurrentUser() currentUser) {
    return this.reportService.getTotalOrdersReport(params, currentUser);
  }

  @Post('set-products-ostatok')
  async setProductsOstatok(@Body() params) {
    return this.reportService.setRestProductCount(params);
  }
}