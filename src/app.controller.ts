import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello() {
    return this.appService.getFakturaWarehouse();
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
