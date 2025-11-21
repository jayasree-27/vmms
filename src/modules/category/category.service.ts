import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const exists = await this.categoryRepo.findOne({
      where: {
        name: dto.name,
      },
    });

    if (exists) {
      throw new ConflictException('category already exists');
    }

    const category = this.categoryRepo.create(dto);
    return await this.categoryRepo.save(category);
  }

  async findAll() {
    return await this.categoryRepo.find({ order: { name: 'ASC' } });
  }
}
