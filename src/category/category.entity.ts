import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "src/product/product.entity";
@Entity('categories')
export class Category{
    @PrimaryGeneratedColumn()
    id:string;

    @Column({type:'varchar',unique:true})
    name:string;

    @OneToMany(()=>Product,(product)=>product.category)
    products:Product[]
}
