import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Category } from 'src/modules/category/category.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { RolesGuard } from 'src/common/guards/role.guard';
@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductController],
  providers: [ProductService,RolesGuard],
  exports: [ProductService],
})
export class ProductModule {}
