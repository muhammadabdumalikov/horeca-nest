import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './decorator/current-user.decorator';
import { AuthGuard } from './guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiBearerAuth('authorization')
  @UseGuards(AuthGuard)
  @Get()
  getHello(@CurrentUser() currentUser) {
    return this.appService.getTotalOrdersReport(currentUser);
  }

  // @Get('read')
  // getRead() {
  //   return this.appService.readExcel();
  // }

  // @Get('akt-sverka')
  // getBye() {
  //   return this.appService.getBye();
  // }
}
