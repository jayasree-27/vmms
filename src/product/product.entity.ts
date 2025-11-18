import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import {Category} from '../category/category.entity';
import { Slot } from 'src/slot/slot.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id:string;

    @Column({type:'varchar'})
    name:string;

    @Column({type:'numeric',precision:10,scale:2})
    price:number;

    @ManyToOne(()=>Category,(category)=>category.products,{eager:true})
    category:Category;

    @OneToMany(()=>Slot,(slot)=>slot.product)
    slots:Slot[];

}