import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Slot } from "../slot.entity";
import { Machine } from "src/machine/machine.entity";
import { RestockSlotDto } from "../dto/restock-slot.dto";
import { CreateSlotDto } from "../dto/create-slot.dto";
import { Product } from "src/product/product.entity";
@Injectable()
export class SlotsService {
    private readonly MAX_STOCK = 10;

    constructor(
        private dataSource: DataSource,
        @InjectRepository(Slot)
        private slotRepo: Repository<Slot>,
        @InjectRepository(Machine)
        private machineRepo: Repository<Machine>
    ) { }


    async createSlot(dto:CreateSlotDto){
        const {machineId,productId,slotNumber}=dto;
        
        return this.dataSource.transaction(async (manager) =>{
            const machine=await manager.findOne(Machine,{where:{id:machineId}})
            if(!machine){
                throw new NotFoundException("Machine not found")
            }

            const product=await manager.findOne(Product,{where:{id:productId}})
            if(!product){
                throw new NotFoundException("Product not found")
            }

            const exsitingSlot=await manager.findOne(Slot,{where:{machine:{id:machineId},slotNumber}})
            if(exsitingSlot){
                throw new BadRequestException(`Slot ${slotNumber} is assigned. USe stock instead.`);
            }

            const slot=manager.create(Slot,{
                machine,
                product,
                slotNumber,
                stockQuantity:0,
            });

            return manager.save(slot);
        });
    }


    async restockSlot(dto:RestockSlotDto){
        const {machineId,slotNumber,quantityToAdd}=dto;

        return this.dataSource.transaction(async (manager)=>{
            const machine=await manager.findOne(Machine,{
                where:{id:machineId},
            })

            if (!machine){
                throw new NotFoundException("Machine not found");
            }

            const slot=await manager.findOne(Slot,{
                where:{machine:{id:machineId},slotNumber},
                relations:['machine','product'],
            });

            if(!slot){
                throw new NotFoundException(`Slot ${slotNumber} not found in machine ${machineId}`);
            }

            const newStock=slot.stockQuantity+quantityToAdd;

            if(newStock > this.MAX_STOCK){
                throw new BadRequestException(
                    `Cannot add ${quantityToAdd}. Slot max stock is ${this.MAX_STOCK}. Current : ${slot.stockQuantity}`,
                );
            }

            slot.stockQuantity=newStock;
            await manager.save(Slot,slot);

            return {
                slotId:slot.id,
                slotNumber:slot.slotNumber,
                stockQuantity:slot.stockQuantity,
                product:slot.product
                ?{
                    id:slot.product.id,
                    name:slot.product.name,
                    price:slot.product.price,
                    category:slot.product.category,
                }
                : null,
            };
        });
    }
}