import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('children/:parent_id')
  getAll(@Param('parent_id') parent_id: string) {
    return this.categoryService.getWithChildren(parent_id);
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
