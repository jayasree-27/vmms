import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from './entitites/slot.entity';
import { Machine } from 'src/modules/machine/machine.entity';
import { SlotsService } from './slots.service';
import { SlotController } from './slot.controller';
import { Product } from 'src/modules/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slot, Machine, Product])],
  providers: [SlotsService],
  controllers: [SlotController],
})
export class SlotsModule {}
