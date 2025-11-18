import { Controller,Post,Body,Get } from "@nestjs/common";
import { CategoryService } from "../services/category.service";
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Controller('category')
export class CategoryController{
    constructor(
        private readonly categoryService:CategoryService,
    ){}

    @Post()
    async create(@Body() dto:CreateCategoryDto){
        return await this.categoryService.create(dto);
    }

    @Get()
    async findAll(){
        return await this.categoryService.findAll();
    }
}