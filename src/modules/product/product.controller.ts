import { Controller, Post, Get, Body ,UseGuards} from '@nestjs/common';
import { ProductService } from './product.service'
import { CreateProductDto } from './dtos/create-product.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
@Controller('products')
@UseGuards(JwtAuthGuard,RolesGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Roles('admin','manager')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get()
  @Roles('admin','manager') 
  async findAll() {
    return this.productService.findAll();
  }
}
