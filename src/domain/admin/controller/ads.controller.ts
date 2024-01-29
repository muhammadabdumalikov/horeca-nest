import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guard/admin.guard';
import { AdminAdvertisementService } from '../service/ads.service';
import { CreateAdsDto, UpdateAdsDto } from '../dto/ads.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';

@ApiTags('Admin')
@ApiBearerAuth('authorization')
@UseGuards(AdminGuard)
@Controller('admin/ads')
export class AdminAdvertisementController {
  constructor(private readonly adminAdsService: AdminAdvertisementService) {}

  @Post('create')
  async setStatus(@Body() params: CreateAdsDto) {
    return this.adminAdsService.create(params);
  }

  @Get('all')
  getAllCategories(@Query() params: ListPageDto) {
    return this.adminAdsService.getAllCategories(params);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() params: UpdateAdsDto) {
    return this.adminAdsService.update(id, params);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminAdsService.delete(id);
  }
}
