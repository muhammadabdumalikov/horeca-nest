import { Module } from '@nestjs/common';
import { FileRouterService } from './file-router.service';
import { FileRouterController } from './file-router.controller';

@Module({
  controllers: [FileRouterController],
  providers: [FileRouterService],
})
export class FileRouterModule {}
