import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from './slot.entity';
import { Machine } from 'src/machine/machine.entity';
import { SlotsService } from './services/slots.service';
import { SlotController } from './controllers/slot.controller';
import { Product } from 'src/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slot, Machine, Product])],
  providers: [SlotsService],
  controllers: [SlotController],
})
export class SlotsModule {}
