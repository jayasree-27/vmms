import { Controller, Post, Body, Get,UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
@Controller('category')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles('admin','manager')
  async create(@Body() dto: CreateCategoryDto) {
    return await this.categoryService.create(dto);
  }

  @Get()
  @Roles('admin','manager')
  async findAll() {
    return await this.categoryService.findAll();
  }
}
