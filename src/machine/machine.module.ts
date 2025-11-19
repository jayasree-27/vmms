import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from './machine.entity';
import { Slot } from 'src/slot/slot.entity';
import { MachineService } from './services/machine.service';
import { MachineController } from './controllers/machine.controller';
import { PurchaseModule } from 'src/purchase/purchase.module';

@Module({
  imports: [TypeOrmModule.forFeature([Machine, Slot]),
  forwardRef(() => PurchaseModule),
],
  controllers: [MachineController],
  providers: [MachineService],
  exports: [MachineService],
})
export class MachinesModule {}
