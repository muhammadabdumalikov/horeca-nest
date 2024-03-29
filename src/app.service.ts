import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { IFile } from './shared/interface/report';
import { DocumentMimeTypes } from './shared/enum/report';
import { ReportService } from './domain/admin/service/report.service';
import * as path from 'path';
import { XLSTableStyles } from './shared/utils/xlsx-styles';
import { FileRouterService } from './domain/file-router/file-router.service';
import { OrderPaymentHistoryTypes, OrderPaymentHistoryTypesStr } from './domain/orders/dto/order.enum';
import formatDateYYYYMMDD from './shared/utils/format-date';
import { IUser } from './domain/user/interface/user.interface';


@Injectable()
export class AppService {
  constructor(private readonly reportService: ReportService, private readonly fileRouterService: FileRouterService) { }

  async getHello() {
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet('table_1', {
      pageSetup: {
        fitToWidth: 1,
        orientation: 'landscape',
      },
    });
    let startRowIndex = 1;
    let worksheet = workbook.getWorksheet(1);

    let data = await this.reportService.getFakturaOrder(
      {
        order_ids: ["65f5db9ffffcd3362049961d", "65e9cb626cfe07539592327f", "65e9cca96cfe075395923284"],
      }
    );

    worksheet.getColumn(1).width = 4;
    worksheet.getColumn(2).width = 40;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 20;

    worksheet.getColumn(6).width = 5;

    worksheet.getColumn(7).width = 4;
    worksheet.getColumn(8).width = 40;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 10;
    worksheet.getColumn(11).width = 20;
    // data = [data[0]];
    const cell_style: any = XLSTableStyles.tableCellTextLeft;
    const cell_bold_center_style: any = XLSTableStyles.tableCellTextCenterAndBold;
    const cell_center_style: any = XLSTableStyles.tableCellTextCenter;
    const cell_bold_right_style: any = XLSTableStyles.tableCellTextRightWithBold;


    for (let i = 0; i < data.length; i++) {
      const order_raw = data[i];
      worksheet.getCell(`A${startRowIndex + i}`).style = cell_style;
      worksheet.mergeCells(`A${startRowIndex + i}:B${startRowIndex + i}`);
      worksheet.getCell(`A${startRowIndex + i}`).value = `Контрагент: ${order_raw.client_name}`;

      worksheet.getCell(`C${startRowIndex + i}`).style = cell_style;
      worksheet.mergeCells(`C${startRowIndex + i}:E${startRowIndex + i}`);
      worksheet.getCell(`C${startRowIndex + i}`).value = `Дата заказа: ${order_raw.created_at}`;

      worksheet.getCell(`G${startRowIndex + i}`).style = cell_style;
      worksheet.mergeCells(`G${startRowIndex + i}:H${startRowIndex + i}`);
      worksheet.getCell(`G${startRowIndex + i}`).value = `Контрагент: ${order_raw.client_name}`;

      worksheet.getCell(`I${startRowIndex + i}`).style = cell_style;
      worksheet.mergeCells(`I${startRowIndex + i}:K${startRowIndex + i}`);
      worksheet.getCell(`I${startRowIndex + i}`).value = `Дата заказа: ${order_raw.created_at}`;

      worksheet.getCell(`A${startRowIndex + i + 1}`).style = cell_style;
      worksheet.mergeCells(`A${startRowIndex + i + 1}:B${startRowIndex + i + 1}`);
      worksheet.getCell(`A${startRowIndex + i + 1}`).value = ':: HORECA TRADE GROUP';

      worksheet.getCell(`C${startRowIndex + i + 1}`).style = cell_style;
      worksheet.mergeCells(`C${startRowIndex + i + 1}:E${startRowIndex + i + 1}`);
      worksheet.getCell(`C${startRowIndex + i + 1}`).value = `Адрес: test`;

      worksheet.getCell(`G${startRowIndex + i + 1}`).style = cell_style;
      worksheet.mergeCells(`G${startRowIndex + i + 1}:H${startRowIndex + i + 1}`);
      worksheet.getCell(`G${startRowIndex + i + 1}`).value = ':: HORECA TRADE GROUP';

      worksheet.getCell(`I${startRowIndex + i + 1}`).style = cell_style;
      worksheet.mergeCells(`I${startRowIndex + i + 1}:K${startRowIndex + i + 1}`);
      worksheet.getCell(`I${startRowIndex + i + 1}`).value = `Ориентир: test`;

      worksheet.getCell(`A${startRowIndex + i + 2}`).style = cell_style;
      worksheet.mergeCells(`A${startRowIndex + i + 2}:B${startRowIndex + i + 2}`);
      worksheet.getCell(`A${startRowIndex + i + 2}`).value = `Агент: ${order_raw.registrator_first_name} ${order_raw.registrator_last_name}`;

      worksheet.getCell(`C${startRowIndex + i + 2}`).style = cell_style;
      worksheet.mergeCells(`C${startRowIndex + i + 2}:E${startRowIndex + i + 2}`);
      worksheet.getCell(`C${startRowIndex + i + 2}`).value = `Тел. контр.: ${order_raw.client_phone}`;

      worksheet.getCell(`G${startRowIndex + i + 2}`).style = cell_style;
      worksheet.mergeCells(`G${startRowIndex + i + 2}:H${startRowIndex + i + 2}`);
      worksheet.getCell(`G${startRowIndex + i + 2}`).value = `Агент: ${order_raw.registrator_first_name} ${order_raw.registrator_last_name}`;

      worksheet.getCell(`I${startRowIndex + i + 2}`).style = cell_style;
      worksheet.mergeCells(`I${startRowIndex + i + 2}:K${startRowIndex + i + 2}`);
      worksheet.getCell(`I${startRowIndex + i + 2}`).value = `Тел. агента.: ${order_raw.registrator_phone}`;

      worksheet.getCell(`A${startRowIndex + i + 3}`).style = cell_style;
      worksheet.mergeCells(`A${startRowIndex + i + 3}:B${startRowIndex + i + 3}`);
      worksheet.getCell(`A${startRowIndex + i + 3}`).value = `Тип оплаты: ${order_raw.payment_type_name?.name_uz}`;

      worksheet.getCell(`C${startRowIndex + i + 3}`).style = cell_style;
      worksheet.mergeCells(`C${startRowIndex + i + 3}:E${startRowIndex + i + 3}`);
      worksheet.getCell(`C${startRowIndex + i + 3}`).value = `Тел. агента: ${order_raw.registrator_phone}`;

      worksheet.getCell(`G${startRowIndex + i + 3}`).style = cell_style;
      worksheet.mergeCells(`G${startRowIndex + i + 3}:H${startRowIndex + i + 3}`);
      worksheet.getCell(`G${startRowIndex + i + 3}`).value = `Доставщик: ${order_raw.deliver_user_json?.first_name} ${order_raw.deliver_user_json?.last_name}`;

      worksheet.getCell(`I${startRowIndex + i + 3}`).style = cell_style;
      worksheet.mergeCells(`I${startRowIndex + i + 3}:K${startRowIndex + i + 3}`);
      worksheet.getCell(`I${startRowIndex + i + 3}`).value = `Тел. достав.: ${order_raw.deliver_user_json?.phone}`;

      worksheet.getCell(`A${startRowIndex + i + 4}`).style = cell_style;
      worksheet.mergeCells(`A${startRowIndex + i + 4}:B${startRowIndex + i + 4}`);
      worksheet.getCell(`A${startRowIndex + i + 4}`).value = 'Примечание: -';

      worksheet.getCell(`C${startRowIndex + i + 4}`).style = cell_style;
      worksheet.mergeCells(`C${startRowIndex + i + 4}:E${startRowIndex + i + 4}`);
      worksheet.getCell(`C${startRowIndex + i + 4}`).value = `Долг ост.: ostatka`;

      worksheet.getCell(`G${startRowIndex + i + 4}`).style = cell_style;
      worksheet.mergeCells(`G${startRowIndex + i + 4}:H${startRowIndex + i + 4}`);
      worksheet.getCell(`G${startRowIndex + i + 4}`).value = `Тип оплаты:  ${order_raw.payment_type_name?.name_uz}`;

      worksheet.getCell(`I${startRowIndex + i + 4}`).style = cell_style;
      worksheet.mergeCells(`I${startRowIndex + i + 4}:K${startRowIndex + i + 4}`);
      worksheet.getCell(`I${startRowIndex + i + 4}`).value = `Долг ост.: ostatka`;

      worksheet.getCell(`G${startRowIndex + i + 5}`).style = cell_style;
      worksheet.mergeCells(`G${startRowIndex + i + 5}:H${startRowIndex + i + 5}`);
      worksheet.getCell(`G${startRowIndex + i + 5}`).value = 'Примечание: -';

      worksheet.getCell(`A${startRowIndex + i + 6}`).value = '№';
      worksheet.getCell(`A${startRowIndex + i + 6}`).style = cell_bold_center_style;

      worksheet.getCell(`B${startRowIndex + i + 6}`).value = 'Наименование';
      worksheet.getCell(`B${startRowIndex + i + 6}`).style = cell_bold_center_style;

      worksheet.getCell(`C${startRowIndex + i + 6}`).value = 'Цена';
      worksheet.getCell(`C${startRowIndex + i + 6}`).style = cell_bold_center_style;

      worksheet.getCell(`D${startRowIndex + i + 6}`).value = 'К-во';
      worksheet.getCell(`D${startRowIndex + i + 6}`).style = cell_bold_center_style;

      worksheet.getCell(`E${startRowIndex + i + 6}`).value = 'Сумма';
      worksheet.getCell(`E${startRowIndex + i + 6}`).style = cell_bold_center_style;

      worksheet.getCell(`G${startRowIndex + i + 6}`).value = '№';
      worksheet.getCell(`G${startRowIndex + i + 6}`).style = cell_bold_center_style;

      worksheet.getCell(`H${startRowIndex + i + 6}`).value = 'Наименование';
      worksheet.getCell(`H${startRowIndex + i + 6}`).style = cell_bold_center_style;

      worksheet.getCell(`I${startRowIndex + i + 6}`).value = 'Цена';
      worksheet.getCell(`I${startRowIndex + i + 6}`).style = cell_bold_center_style;

      worksheet.getCell(`J${startRowIndex + i + 6}`).value = 'К-во';
      worksheet.getCell(`J${startRowIndex + i + 6}`).style = cell_bold_center_style;

      worksheet.getCell(`K${startRowIndex + i + 6}`).value = 'Сумма';
      worksheet.getCell(`K${startRowIndex + i + 6}`).style = cell_bold_center_style;

      for (let k = 0; k < order_raw.items?.length; k++) {
        const innerStartRowIndex = startRowIndex + 7;
        const item_raw = order_raw.items[k];

        worksheet.getCell(`A${innerStartRowIndex + k}`).value = k + 1;
        worksheet.getCell(`A${innerStartRowIndex + k}`).style = cell_style;

        worksheet.getCell(`B${innerStartRowIndex + k}`).value = item_raw?.name_uz;
        worksheet.getCell(`B${innerStartRowIndex + k}`).style = cell_style;

        worksheet.getCell(`C${innerStartRowIndex + k}`).value = item_raw?.price;
        worksheet.getCell(`C${innerStartRowIndex + k}`).style = cell_style;

        worksheet.getCell(`D${innerStartRowIndex + k}`).value = item_raw?.quantity;
        worksheet.getCell(`D${innerStartRowIndex + k}`).style = cell_style;

        worksheet.getCell(`E${innerStartRowIndex + k}`).value = item_raw?.total_sum;
        worksheet.getCell(`E${innerStartRowIndex + k}`).style = cell_style;

        worksheet.getCell(`G${innerStartRowIndex + k}`).value = k + 1;
        worksheet.getCell(`G${innerStartRowIndex + k}`).style = cell_style;

        worksheet.getCell(`H${innerStartRowIndex + k}`).value = item_raw?.name_uz;
        worksheet.getCell(`H${innerStartRowIndex + k}`).style = cell_style;

        worksheet.getCell(`I${innerStartRowIndex + k}`).value = item_raw?.price;
        worksheet.getCell(`I${innerStartRowIndex + k}`).style = cell_style;

        worksheet.getCell(`J${innerStartRowIndex + k}`).value = item_raw?.quantity;
        worksheet.getCell(`J${innerStartRowIndex + k}`).style = cell_style;

        worksheet.getCell(`K${innerStartRowIndex + k}`).value = item_raw?.total_sum;
        worksheet.getCell(`K${innerStartRowIndex + k}`).style = cell_style;
      }
      worksheet.getCell(`A${startRowIndex + 7 + order_raw.items.length}`).style = cell_bold_right_style;
      worksheet.mergeCells(`A${startRowIndex + 7 + order_raw.items.length}:E${startRowIndex + 7 + order_raw.items.length}`);
      worksheet.getCell(`A${startRowIndex + 7 + order_raw.items.length}`).value = `Итого по инвойсу: 00 шт ${order_raw.total_sum}`;

      worksheet.getCell(`A${startRowIndex + 8 + order_raw.items.length}`).style = cell_center_style;
      worksheet.mergeCells(`A${startRowIndex + 8 + order_raw.items.length}:E${startRowIndex + 8 + order_raw.items.length}`);
      worksheet.getCell(`A${startRowIndex + 8 + order_raw.items.length}`).value = `Сдал____________     Принял____________`;

      worksheet.getCell(`G${startRowIndex + 7 + order_raw.items.length}`).style = cell_bold_right_style;
      worksheet.mergeCells(`G${startRowIndex + 7 + order_raw.items.length}:K${startRowIndex + 7 + order_raw.items.length}`);
      worksheet.getCell(`G${startRowIndex + 7 + order_raw.items.length}`).value = `Итого по инвойсу: 00 шт ${order_raw.total_sum}`;

      worksheet.getCell(`G${startRowIndex + 8 + order_raw.items.length}`).style = cell_center_style;
      worksheet.mergeCells(`G${startRowIndex + 8 + order_raw.items.length}:K${startRowIndex + 8 + order_raw.items.length}`);
      worksheet.getCell(`G${startRowIndex + 8 + order_raw.items.length}`).value = `Сдал____________     Принял____________`;

      startRowIndex += 10 + order_raw.items.length;
    }

    const buffer: any = await workbook.xlsx.writeBuffer();

    const file: IFile = {
      originalname: String('Faktura hisobot'),
      size: String(buffer?.length),
      buffer,
      mimetype: String(DocumentMimeTypes?.XLSX),
      fieldname: String('Faktura hisobot'),
      encoding: '',
    };

    // return buffer;

    const uploadFile: any = await this.fileRouterService.uploadReport(file);

    return uploadFile;
  }

  async getBye() {
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet('table_1', {
      pageSetup: {
        fitToWidth: 1,
        orientation: 'landscape',
      },
    });
    let startRowIndex = 7;
    let worksheet = workbook.getWorksheet(1);

    let data = await this.reportService.getActSverkaReport(
      {
        user_id: '65e735e8c4f2286bf3e4f7d9',
        "from_date": "2024-01-01",
        "to_date": "2024-03-10"
      }
    );

    const cell_right_color_red_style: any = XLSTableStyles.tableCellTextRightColorRed;
    const cell_right_style: any = XLSTableStyles.tableCellTextRight;
    const cell_center_bold: any = XLSTableStyles.tableCellTextCenterAndBold;
    const cell_style: any = XLSTableStyles.tableCellTextCenter;

    worksheet.getColumn(1).width = 25;
    worksheet.getColumn(2).width = 5;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 5;
    worksheet.getColumn(7).width = 25;

    worksheet.getRow(1).height = 15;

    worksheet.getCell('A1').style = cell_center_bold;
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = `Акт сверки между "HORECA TRADE GROUP" и "${data[0]?.user_name}"`

    worksheet.getCell('A2').style = cell_center_bold;
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value = 'Время отчета:';

    worksheet.getCell('D2').style = cell_center_bold;
    worksheet.mergeCells('D2:F2');
    worksheet.getCell('D2').value = new Date();

    worksheet.getCell('A3').style = cell_center_bold;
    worksheet.mergeCells('A3:C3');
    worksheet.getCell('A3').value = 'Начало периода:';

    worksheet.getCell('D3').style = cell_center_bold;
    worksheet.mergeCells('D3:F3');
    worksheet.getCell('D3').value = '2024-03-01';

    worksheet.getCell('A4').style = cell_center_bold;
    worksheet.mergeCells('A4:C4');
    worksheet.getCell('A4').value = 'Конец периода:';

    worksheet.getCell('D4').style = cell_center_bold;
    worksheet.mergeCells('D4:F4');
    worksheet.getCell('D4').value = '2024-03-10';

    worksheet.getCell('A5').style = cell_center_bold;
    worksheet.mergeCells('A5:B5');
    worksheet.getCell('A5').value = 'Дата';

    worksheet.getCell('C5').style = cell_center_bold;
    worksheet.mergeCells('C5:D5');
    worksheet.getCell('C5').value = 'Наименование';

    worksheet.getCell('E5').style = cell_center_bold;
    worksheet.mergeCells('E5:F5');
    worksheet.getCell('E5').value = 'Сумма';

    worksheet.getCell('G5').style = cell_center_bold;
    worksheet.getCell('G5').value = 'Баланс';

    worksheet.getCell('A6').style = cell_center_bold;
    worksheet.mergeCells('A6:F6');
    worksheet.getCell('A6').value = 'Баланс';

    worksheet.getCell('G6').style = data[0]?.balance < 0 ? cell_right_color_red_style : cell_right_style;
    worksheet.getCell('G6').value = data[0]?.balance;

    let monthly_balance = 0;
    for (let i = 0; i < data.length; i++) {
      const history_raw = data[i];
      const isDebt = history_raw.type === OrderPaymentHistoryTypes.DEBT;

      worksheet.getCell(`A${startRowIndex + i}`).style = cell_style;
      worksheet.mergeCells(`A${startRowIndex + i}:B${startRowIndex + i}`);
      worksheet.getCell(`A${startRowIndex + i}`).value = history_raw.created_at;

      worksheet.getCell(`C${startRowIndex + i}`).style = cell_style;
      worksheet.mergeCells(`C${startRowIndex + i}:D${startRowIndex + i}`);
      worksheet.getCell(`C${startRowIndex + i}`).value = OrderPaymentHistoryTypesStr[history_raw.type];

      worksheet.getCell(`E${startRowIndex + i}`).style = isDebt
        ? cell_right_color_red_style
        : cell_right_style;
      worksheet.mergeCells(`E${startRowIndex + i}:F${startRowIndex + i}`);
      worksheet.getCell(`E${startRowIndex + i}`).value = Number(`${isDebt ? '-' : ''}${history_raw.value}`);

      if (isDebt) {
        monthly_balance -= history_raw.value
      } else {
        monthly_balance += history_raw.value
      }

      worksheet.getCell(`G${startRowIndex + i}`).style = monthly_balance < 0 ? cell_right_color_red_style : cell_right_style;
      worksheet.getCell(`G${startRowIndex + i}`).value = Number(monthly_balance);
    }

    const buffer: any = await workbook.xlsx.writeBuffer();

    const file: IFile = {
      originalname: String('Faktura hisobot'),
      size: String(buffer?.length),
      buffer,
      mimetype: String(DocumentMimeTypes?.XLSX),
      fieldname: String('Faktura hisobot'),
      encoding: '',
    };

    // return buffer;

    const uploadFile: any = await this.fileRouterService.uploadReport(file);

    return uploadFile;
  }

  async getAllProducts() {
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet('table_1', {
      pageSetup: {
        fitToWidth: 1,
        orientation: 'landscape',
      },
    });
    let startRowIndex = 1;
    let worksheet = workbook.getWorksheet(1);

    let data = await this.reportService.getAllProductsListForExcel();

    worksheet.getColumn(1).width = 35;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 60;
    worksheet.getColumn(4).width = 60;
    worksheet.getColumn(5).width = 15;

    for (let i = 0; i < data.length; i++) {
      const data_raw = data[i];
      worksheet.getCell(`A${startRowIndex + i}`).value = data_raw.id;
      worksheet.getCell(`B${startRowIndex + i}`).value = data_raw.barcode;
      worksheet.getCell(`C${startRowIndex + i}`).value = data_raw.name_uz;
      worksheet.getCell(`D${startRowIndex + i}`).value = data_raw.name_ru;
      worksheet.getCell(`E${startRowIndex + i}`).value = data_raw.product_count;
    }

    const buffer: any = await workbook.xlsx
      .writeFile(path.join(__dirname, '/../example.xlsx'), { filename: 'Faktura hisobot' });

    const file: IFile = {
      originalname: String(`Mahsulotlar qoldig'i`),
      size: String(buffer?.length),
      buffer,
      mimetype: String(DocumentMimeTypes?.XLSX),
      fieldname: String(`Mahsulotlar qoldig'i`),
      encoding: '',
    };

    // return buffer;

    // const uploadFile: any = await this.fileRouterService.uploadReport(file);

    // return uploadFile;
  }

  async readExcel() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('./example.xlsx');
    const productObj = {};
    // Assuming the data is on the first worksheet
    const worksheet = workbook.getWorksheet(1);

    for (let i = 1; i <= worksheet.rowCount; i++) {
      const prodIndex = worksheet.getCell(`A${i}`).value || 'ERROR';
      productObj[prodIndex as string] = worksheet.getCell(`E${i}`).value;
    }

    return this.reportService.setRestProductCount(productObj);
  }

  async getFakturaWarehouse() {
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet('table_1', {
      pageSetup: {
        fitToWidth: 1,
        orientation: 'landscape',
      },
    });
    let startRowIndex = 1;
    let worksheet = workbook.getWorksheet(1);

    let data = await this.reportService.getFakturaOrder(
      {
        order_ids: ["65f5db9ffffcd3362049961d", "65e9cb626cfe07539592327f", "65e9cca96cfe075395923284", "65e736dac4f2286bf3e4f7da"],
      }
    );

    worksheet.getColumn(1).width = 4;
    worksheet.getColumn(2).width = 40;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 20;

    worksheet.getColumn(6).width = 5;

    worksheet.getColumn(7).width = 4;
    worksheet.getColumn(8).width = 40;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 10;
    worksheet.getColumn(11).width = 20;
    // data = [data[0]];
    const cell_style: any = XLSTableStyles.tableCellTextLeft;
    const cell_bold_center_style: any = XLSTableStyles.tableCellTextCenterAndBold;
    const cell_center_style: any = XLSTableStyles.tableCellTextCenter;
    const cell_bold_right_style: any = XLSTableStyles.tableCellTextRightWithBold;

    for (let i = 0; i < data.length; i++) {
      const order_raw = data[i];
      worksheet.getCell(`A${startRowIndex + i}`).style = cell_style;
      worksheet.mergeCells(`A${startRowIndex + i}:B${startRowIndex + i}`);
      worksheet.getCell(`A${startRowIndex + i}`).value = `Тип документа: -`;

      worksheet.getCell(`C${startRowIndex + i}`).style = cell_style;
      worksheet.mergeCells(`C${startRowIndex + i}:E${startRowIndex + i}`);
      worksheet.getCell(`C${startRowIndex + i}`).value =
        `Дата заказа: ${(order_raw.created_at as Date).toLocaleString('en-US', { timeZone: 'Asia/Tashkent', hour12: false })}`;

      worksheet.getCell(`A${startRowIndex + i + 1}`).style = cell_style;
      worksheet.mergeCells(`A${startRowIndex + i + 1}:B${startRowIndex + i + 1}`);
      worksheet.getCell(`A${startRowIndex + i + 1}`).value = `Контрагент: ${order_raw.client_name}`;

      worksheet.getCell(`C${startRowIndex + i + 1}`).style = cell_style;
      worksheet.mergeCells(`C${startRowIndex + i + 1}:E${startRowIndex + i + 1}`);
      worksheet.getCell(`C${startRowIndex + i + 1}`).value = `Тел. контр.: ${order_raw.client_phone}`;

      worksheet.getCell(`A${startRowIndex + i + 2}`).style = cell_style;
      worksheet.mergeCells(`A${startRowIndex + i + 2}:B${startRowIndex + i + 2}`);
      worksheet.getCell(`A${startRowIndex + i + 2}`).value = `Агент: ${order_raw.registrator_first_name} ${order_raw.registrator_last_name}`;

      worksheet.getCell(`C${startRowIndex + i + 2}`).style = cell_style;
      worksheet.mergeCells(`C${startRowIndex + i + 2}:E${startRowIndex + i + 2}`);
      worksheet.getCell(`C${startRowIndex + i + 2}`).value = `Тел. агента.: ${order_raw.registrator_phone}`;

      worksheet.getCell(`A${startRowIndex + i + 3}`).style = cell_style;
      worksheet.mergeCells(`A${startRowIndex + i + 3}:B${startRowIndex + i + 3}`);
      worksheet.getCell(`A${startRowIndex + i + 3}`).value = `Доставщик: ${order_raw.deliver_user_json?.first_name} ${order_raw.deliver_user_json?.last_name}`;

      worksheet.getCell(`C${startRowIndex + i + 3}`).style = cell_style;
      worksheet.mergeCells(`C${startRowIndex + i + 3}:E${startRowIndex + i + 3}`);
      worksheet.getCell(`C${startRowIndex + i + 3}`).value = `Тел. достав.: ${order_raw.deliver_user_json?.phone}`;

      worksheet.getCell(`A${startRowIndex + i + 4}`).style = cell_style;
      worksheet.mergeCells(`A${startRowIndex + i + 4}:B${startRowIndex + i + 4}`);
      worksheet.getCell(`A${startRowIndex + i + 4}`).value = `Склада: -`;

      worksheet.getCell(`C${startRowIndex + i + 4}`).style = cell_style;
      worksheet.mergeCells(`C${startRowIndex + i + 4}:E${startRowIndex + i + 4}`);
      worksheet.getCell(`C${startRowIndex + i + 4}`).value = 'Примечание: -';

      worksheet.getCell(`A${startRowIndex + i + 6}`).value = '№';
      worksheet.getCell(`A${startRowIndex + i + 6}`).style = cell_bold_center_style;

      worksheet.getCell(`B${startRowIndex + i + 6}`).value = 'Наименование';
      worksheet.getCell(`B${startRowIndex + i + 6}`).style = cell_bold_center_style;

      worksheet.getCell(`C${startRowIndex + i + 6}`).value = 'Цена';
      worksheet.getCell(`C${startRowIndex + i + 6}`).style = cell_bold_center_style;

      worksheet.getCell(`D${startRowIndex + i + 6}`).value = 'К-во';
      worksheet.getCell(`D${startRowIndex + i + 6}`).style = cell_bold_center_style;

      worksheet.getCell(`E${startRowIndex + i + 6}`).value = 'Сумма';
      worksheet.getCell(`E${startRowIndex + i + 6}`).style = cell_bold_center_style;

      for (let k = 0; k < order_raw.items?.length; k++) {
        let innerStartRowIndex = startRowIndex + 7 + i;
        const item_raw = order_raw.items[k];

        worksheet.getCell(`A${innerStartRowIndex + k}`).value = k + 1;
        worksheet.getCell(`A${innerStartRowIndex + k}`).style = cell_style;

        worksheet.getCell(`B${innerStartRowIndex + k}`).value = item_raw?.name_uz;
        worksheet.getCell(`B${innerStartRowIndex + k}`).style = cell_style;

        worksheet.getCell(`C${innerStartRowIndex + k}`).value = item_raw?.price;
        worksheet.getCell(`C${innerStartRowIndex + k}`).style = cell_style;

        worksheet.getCell(`D${innerStartRowIndex + k}`).value = item_raw?.quantity;
        worksheet.getCell(`D${innerStartRowIndex + k}`).style = cell_style;

        worksheet.getCell(`E${innerStartRowIndex + k}`).value = item_raw?.total_sum;
        worksheet.getCell(`E${innerStartRowIndex + k}`).style = cell_style;

        // innerStartRowIndex += k + 1;
      }

      worksheet.getCell(`A${startRowIndex + i + 7 + order_raw.items.length}`).style = cell_bold_right_style;
      worksheet.mergeCells(`A${startRowIndex + i + 7 + order_raw.items.length}:E${startRowIndex + i + 7 + order_raw.items.length}`);
      worksheet.getCell(`A${startRowIndex + i + 7 + order_raw.items.length}`).value = `Итого по инвойсу: 00 шт ${order_raw.total_sum}`;

      worksheet.getCell(`A${startRowIndex + i + 8 + order_raw.items.length}`).style = cell_center_style;
      worksheet.mergeCells(`A${startRowIndex + i + 8 + order_raw.items.length}:E${startRowIndex + i + 8 + order_raw.items.length}`);
      worksheet.getCell(`A${startRowIndex + i + 8 + order_raw.items.length}`).value = `Сдал____________     Принял____________`;

      startRowIndex += 10 + order_raw.items.length;
    }

    const buffer: any = await workbook.xlsx.writeBuffer();

    const file: IFile = {
      originalname: String('Faktura hisobot'),
      size: String(buffer?.length),
      buffer,
      mimetype: String(DocumentMimeTypes?.XLSX),
      fieldname: String('Faktura hisobot'),
      encoding: '',
    };

    // return buffer;

    const uploadFile: any = await this.fileRouterService.uploadReport(file);

    return uploadFile;
  }

  async getTotalOrdersReport(currentUser: IUser) {
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet('table_1', {
      pageSetup: {
        fitToWidth: 1,
        orientation: 'landscape',
      },
    });
    let startRowIndex = 7;
    let worksheet = workbook.getWorksheet(1);

    let data = await this.reportService.getTotalOrdersReport(
      {
        order_ids: ["65f5db9ffffcd3362049961d", "65e9cb626cfe07539592327f", "65e9cca96cfe075395923284", "65e736dac4f2286bf3e4f7da"],
      },
      currentUser
    );

    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 50;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;

    const cell_style: any = XLSTableStyles.tableCellTextLeft;
    const cell_bold_left_style: any = XLSTableStyles.tableCellTextLeftWithBold;
    const cell_center_style: any = XLSTableStyles.tableCellTextCenter;
    const cell_bold_right_style: any = XLSTableStyles.tableCellTextRightWithBold;
    const cell_right_style: any = XLSTableStyles.tableCellTextRight

    worksheet.mergeCells(`A1:E1`);
    worksheet.getCell('A1').value = `Даты отгрузки: ${formatDateYYYYMMDD(new Date())}`;
    worksheet.mergeCells(`A2:E2`);
    worksheet.getCell('A2').value = `Агенты: ${data.currentUser?.phone} (${data.currentUser?.first_name} ${data.currentUser?.last_name})`;
    worksheet.mergeCells(`A3:E3`);
    worksheet.getCell('A3').value = `Рабочие пространства: -`;
    worksheet.mergeCells(`A4:E4`);
    worksheet.getCell('A4').value = `№ :${data.data.map(item => ' ' + item?.order_number)}`;
    worksheet.mergeCells(`A5:E5`);
    worksheet.getCell('A5').value = `Кол. фактури: ${data.data.length}`;

    worksheet.getCell('A6').style = cell_style;
    worksheet.getCell('A6').value = `Код`;
    worksheet.getCell('B6').style = cell_style;
    worksheet.getCell('B6').value = `Наименование`;
    worksheet.getCell('C6').style = cell_style;
    worksheet.getCell('C6').value = `Кол-во`;
    worksheet.getCell('D6').style = cell_style;
    worksheet.getCell('D6').value = `Кор + шт`;
    worksheet.getCell('E6').style = cell_style;
    worksheet.getCell('E6').value = `Сумма`;

    let i = 0;
    let dataRowIndex = 0;

    while (i < data.data.length) {
      const order_raw = data.data[i];
      for (let k = 0; k < order_raw?.order_items?.length; k++) {
        worksheet.getCell(`A${startRowIndex + dataRowIndex}`).style = cell_style;
        worksheet.getCell(`A${startRowIndex + dataRowIndex}`).value = order_raw?.order_number;
        worksheet.getCell(`B${startRowIndex + dataRowIndex}`).style = cell_style;
        worksheet.getCell(`B${startRowIndex + dataRowIndex}`).value = order_raw?.order_items[k]?.name_uz;
        worksheet.getCell(`C${startRowIndex + dataRowIndex}`).style = cell_right_style;
        worksheet.getCell(`C${startRowIndex + dataRowIndex}`).value = +order_raw?.order_items[k]?.quantity;
        const block = Math.floor(+order_raw?.order_items[k]?.quantity / +order_raw?.order_items[k]?.count_in_block);
        const remainingPieces = +order_raw?.order_items[k]?.quantity % +order_raw?.order_items[k]?.count_in_block;
        worksheet.getCell(`D${startRowIndex + dataRowIndex}`).style = cell_center_style;
        worksheet.getCell(`D${startRowIndex + dataRowIndex}`).value =
          (block > 0 ? `${block} Кор` : '') +
          (remainingPieces > 0 ? `${remainingPieces}+ шт` : '');
        worksheet.getCell(`E${startRowIndex + dataRowIndex}`).style = cell_style;
        worksheet.getCell(`E${startRowIndex + dataRowIndex}`).value = +order_raw?.order_items[k]?.total_price;

        dataRowIndex++;
      }
      i++;
    }

    worksheet.getCell(`A${startRowIndex + dataRowIndex}`).style = cell_bold_left_style;
    worksheet.getCell(`A${startRowIndex + dataRowIndex}`).value = 'Сумма';
    worksheet.getCell(`B${startRowIndex + dataRowIndex}`).style = cell_bold_left_style;
    worksheet.getCell(`B${startRowIndex + dataRowIndex}`).value = 'ИТОГО';
    worksheet.getCell(`C${startRowIndex + dataRowIndex}`).style = cell_bold_right_style;
    worksheet.getCell(`C${startRowIndex + dataRowIndex}`).value = {
      formula: `SUM(C${startRowIndex}:C${startRowIndex + data.data.length})`,
      date1904: false,
    };
    worksheet.getCell(`D${startRowIndex + dataRowIndex}`).style = cell_bold_left_style;
    worksheet.getCell(`E${startRowIndex + dataRowIndex}`).style = cell_bold_left_style;
    worksheet.getCell(`E${startRowIndex + dataRowIndex}`).value = {
      formula: `SUM(E${startRowIndex}:E${startRowIndex + data.data.length})`,
      date1904: false,
    };

    const buffer: any = await workbook.xlsx.writeBuffer();

    const file: IFile = {
      originalname: String('ИТОГ'),
      size: String(buffer?.length),
      buffer,
      mimetype: String(DocumentMimeTypes?.XLSX),
      fieldname: String('ИТОГ'),
      encoding: '',
    };

    // return buffer;

    const uploadFile: any = await this.fileRouterService.uploadReport(file);

    return uploadFile;
  }
}
