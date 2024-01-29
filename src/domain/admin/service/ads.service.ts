import { Injectable } from '@nestjs/common';
import { AdminAdvertisementRepo } from '../repo/ads.repo';
import { CreateAdsDto, UpdateAdsDto } from '../dto/ads.dto';
import { isEmpty } from 'lodash';
import { CategoryNotFoundException } from 'src/errors/permission.error';
import { ListPageDto } from 'src/shared/dto/list.dto';

@Injectable()
export class AdminAdvertisementService {
  constructor(private readonly adsRepo: AdminAdvertisementRepo) { }

  async create(params: CreateAdsDto) {
    return await this.adsRepo.insert({
      link: params.link,
      image: params.image,
      title: params.title,
    });
  }

  async update(id: string, params: UpdateAdsDto) {
    const category = await this.adsRepo.selectById(id);

    if (isEmpty(category)) {
      throw new CategoryNotFoundException();
    }

    return this.adsRepo.updateById(id, {
      link: params.link,
      image: params.image,
      title: params.title,
    });
  }

  async delete(id: string) {
    const category = await this.adsRepo.selectById(id);

    if (isEmpty(category)) {
      throw new CategoryNotFoundException();
    }

    return this.adsRepo.softDelete(id);
  }

  async getAllCategories(params: ListPageDto) {
    return this.adsRepo.select(
      { is_deleted: false },
      { limit: params.limit, offset: params.offset },
    );
  }
}
