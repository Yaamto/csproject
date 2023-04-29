import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryDto } from './dto/category.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('category')
@Serialize(CategoryDto)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: CreateCategoryDto) {
    return this.categoryService.create(body.name);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string, @Body() body: UpdateCategoryDto) {
    return this.categoryService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string) {
    return this.categoryService.remove(id);
  }
}
