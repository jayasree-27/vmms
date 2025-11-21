import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from 'src/modules/slot/entitites/slot.entity';
import { Product } from 'src/modules/product/product.entity';
import { Machine } from 'src/modules/machine/machine.entity';
import { Transaction } from '../transactions/transaction.entity';
import { BullMQService } from 'src/services/bullmq-services';
import { PurchaseWorkerService } from 'src/services/purchase-worker.service';
import { AlertsController } from 'src/controllers/alert.controller';
import { JobsController } from 'src/controllers/jobs.controller';
import { MachinesModule } from 'src/modules/machine/machine.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Slot, Product, Machine, Transaction]),
    forwardRef(() => MachinesModule),
  ],
  controllers: [AlertsController, JobsController],
  providers: [BullMQService, PurchaseWorkerService],
  exports: [BullMQService],
})
export class PurchaseModule {}
