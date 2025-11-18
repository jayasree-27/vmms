import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MachinesModule } from "./machine/machine.module";
import { SlotsModule } from "./slot/slots.module";
import { Machine } from "./machine/machine.entity";
import { Slot } from "./slot/slot.entity";
import {Product} from "./product/product.entity";
import {Category} from "./category/category.entity";
import { CategoryModule } from "./category/category.module";
import { ProductModule } from "./product/product.module";

@Module({
  imports:[
    TypeOrmModule.forRoot({
      type:"postgres",
      host:"localhost",
      port:5432,
      username:"postgres",
      password:"Jayasree275",
      database:"vending_machine_db",
      entities:[Machine,Slot,Product,Category],
      synchronize:true
    }),
    MachinesModule,
    SlotsModule,
    CategoryModule,
    ProductModule
  ],
})
export class AppModule {}