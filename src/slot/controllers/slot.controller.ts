import { Controller, Post, Body } from '@nestjs/common';
import { SlotsService } from '../services/slots.service';
import { RestockSlotDto } from '../dto/restock-slot.dto';
import { CreateSlotDto } from '../dto/create-slot.dto';
@Controller('slots')
export class SlotController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  async restock(@Body() dto: RestockSlotDto) {
    return this.slotsService.restockSlot(dto);
  }

  @Post('create')
  async create(@Body() dto: CreateSlotDto) {
    return this.slotsService.createSlot(dto);
  }
}
