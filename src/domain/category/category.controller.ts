import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';
import { ListPageDto } from 'src/shared/dto/list.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('all')
  getAll(@Query() params: ListPageDto) {
    return this.categoryService.findAll(params);
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
}
