import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Slot } from "src/slot/slot.entity";
import { Product } from "src/product/product.entity";
import { Machine } from "src/machine/machine.entity";
import { Transaction } from "../transactions/transaction.entity";
import { BullMQService } from "src/services/bullmq-services";
import { PurchaseWorkerService } from "src/services/purchase-worker.service";
import { AlertsController } from "src/controllers/alert.controller";
import { JobsController } from "src/controllers/jobs.controller";
import { MachinesModule } from "src/machine/machine.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([Slot,Product,Machine,Transaction]),
        forwardRef(() => MachinesModule),
    ],
    controllers:[AlertsController,JobsController],
    providers:[
        BullMQService,
        PurchaseWorkerService
    ],
    exports:[BullMQService]
})
export class PurchaseModule {}