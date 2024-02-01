import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';
import { ListPageDto } from 'src/shared/dto/list.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('children/:parent_id')
  getAllWithChildren(@Param('parent_id') parent_id: string) {
    return this.categoryService.getWithChildren(parent_id);
  }

  @Get('all')
  getAll(@Query() params: ListPageDto) {
    return this.categoryService.findAll(params);
  }

  @Get('parents')
  getAllParentCategories() {
    return this.categoryService.getAllParentCategories();
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
}
