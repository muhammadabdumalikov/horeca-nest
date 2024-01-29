import {
  Controller,
  Injectable,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileRouterService } from './file-router.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@Injectable()
@Controller('file-router')
@ApiTags('File Router')
export class FileRouterController {
  constructor(private readonly fileRouterService: FileRouterService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // comment: { type: 'string' },
        // outletId: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  // @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.fileRouterService.upload(file);
  }

  // @Get('download/:file_id')
  // async download(@Param('file_id') file_id: string) {
  //   return this.fileRouterService.download(file_id);
  // }
}
