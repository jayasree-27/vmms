import { Controller,Post,Get,Body } from "@nestjs/common";
import { ProductService } from "../services/product.service";
import { CreateProductDto } from "../dtos/create-product.dto";

@Controller('products')
export class ProductController{
    constructor(private productService:ProductService){}

    @Post()
    async create(@Body() dto:CreateProductDto){
        return this.productService.create(dto)
    }

    @Get()
    async findAll(){
        return this.productService.findAll()
    }
}