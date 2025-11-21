import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { RolesGuard } from 'src/common/guards/role.guard';
@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService,RolesGuard],
  exports: [CategoryService],
})
export class CategoryModule {}
