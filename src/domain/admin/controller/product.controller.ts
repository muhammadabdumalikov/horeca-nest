import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { AdminProductService } from '../service/product.service';
import { SetProductStatusDto } from '../dto/product-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guard/admin.guard';
import { ProductService } from 'src/domain/product/product.service';
import { OrderListDto } from 'src/domain/orders/dto/order.dto';
import { ListPageDto } from 'src/shared/dto/list.dto';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { CreateProductDto, UpdateProductDto } from 'src/domain/product/dto/product.dto';
import { IUser } from 'src/domain/user/interface/user.interface';
import { AdminCategoryListPageDto } from '../dto/category-admin.dto';

@ApiTags('Admin')
// @ApiBearerAuth('authorization')
// @UseGuards(AdminGuard)
@Controller('admin/product')
export class AdminProductController {
  constructor(
    private readonly adminProductService: AdminProductService,
    private readonly productService: ProductService,
  ) { }

  @Post()
  create(@Body() params: CreateProductDto, @CurrentUser() currentUser: IUser) {
    return this.adminProductService.create(params, currentUser);
  }

  @Get('list')
  async list(@Query() params: AdminCategoryListPageDto) {
    return this.adminProductService.findAll(params);
  }

  @Post('set-status')
  async setStatus(@Body() params: SetProductStatusDto) {
    return this.adminProductService.setStatus(params);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() params: UpdateProductDto) {
    return this.adminProductService.update(id, params);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminProductService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminProductService.delete(id);
  }
}
