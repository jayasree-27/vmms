import { Injectable,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../product.entity";
import { Category } from "src/category/category.entity";
import { CreateProductDto } from "../dtos/create-product.dto";

@Injectable()
export class ProductService{
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ){}

    async create(dto: CreateProductDto): Promise<Product> {
        const category=await this.categoryRepo.findOne({
            where:{
                id:dto.categoryId
            }
        });

        if(!category){
            throw new NotFoundException('Category not found');
        }

        const product=this.productRepo.create({
            name:dto.name,
            price:dto.price,
            category:category
        });

        return await this.productRepo.save(product);
    }

    async findAll(){
        return await this.productRepo.find();
    }
}