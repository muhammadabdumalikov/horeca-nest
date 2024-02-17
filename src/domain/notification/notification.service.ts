import { Injectable } from '@nestjs/common';
import { CreateNotificationDto, NotificationListDto, UpdateNotificationDto } from './dto/create-notification.dto';
import { NotificationRepo } from './notification.repo';
import { IListPage } from 'src/shared/interface/list.interface';
import { isEmpty } from 'lodash';
import { NotificationNotFoundException } from 'src/errors/permission.error';
import { IFirebaseTopicMessage, sendFirebaseNotification, sendFirebaseToTopic } from 'src/providers/firebase.service';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepo) { }
  
  async create(params: CreateNotificationDto) {
    const notification = await this.notificationRepo.insert({
      title: params.title,
      body: params?.body,
      image: params?.image,
      link: params?.link
    });

    const firebaseNotification: IFirebaseTopicMessage = {
      notification: {
        title: notification[0]?.title,
        body: notification[0]?.body,
      },
      data: {
        notification_id: notification[0]?.id,
      },
      topic: 'HORECA'
    }

    await sendFirebaseNotification(firebaseNotification);
    
    return { success: true };
  }

  async findAll(params: NotificationListDto) {
    const knex = this.notificationRepo.knex;
    let query = knex
      .select(['*', knex.raw('count(id) over() as total')])
      .from(this.notificationRepo._tableName)
      .orderBy('created_at', 'desc');

    if (params.limit) {
      query = query.limit(Number(params.limit));
    }

    if (params.offset) {
      query = query.offset(Number(params.offset));
    }

    if (params?.is_deleted === 'true') {
      query.where('is_deleted', true);
    }

    if (params?.is_deleted === 'false') {
      query.where('is_deleted', false);
    }

    const data = await query;

    return { data: data, total_count: data[0] ? +data[0].total : 0 };
  }

  async findOne(id: string) {
    const notification = await this.notificationRepo.selectById(id);

    if (!notification) {
      throw new NotificationNotFoundException();
    }

    return notification;
  }

  update(id: string, params: UpdateNotificationDto) {
    return this.notificationRepo.updateById(id, {
      title: params.title,
      body: params?.body,
      image: params?.image,
      link: params?.link
    })
  }

  async delete(id: string) {
    const company = await this.notificationRepo.selectById(id);

    if (isEmpty(company)) {
      throw new NotificationNotFoundException();
    }

    await this.notificationRepo.softDelete(id);

    return { success: true };
  }
}
