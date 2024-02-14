import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationRepo } from './notification.repo';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepo],
})
export class NotificationModule {}
