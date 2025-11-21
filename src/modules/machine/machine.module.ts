import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from './machine.entity';
import { Slot } from '../slot/entitites/slot.entity'
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';
import { PurchaseModule } from '../purchase/purchase.module';
import { RolesGuard } from 'src/common/guards/role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Machine, Slot]),
  forwardRef(() => PurchaseModule),
],
  controllers: [MachineController],
  providers: [MachineService,RolesGuard],
  exports: [MachineService],
})
export class MachinesModule {}
