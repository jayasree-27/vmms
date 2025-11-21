import { Controller, Post, Body,UseGuards ,Patch,Delete,Param,Get} from '@nestjs/common';
import { SlotsService } from './slots.service';
import { RestockSlotDto } from './dto/restock-slot.dto';
import { CreateSlotDto } from './dto/create-slot.dto';
import {JwtAuthGuard} from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UpdateSlotDto } from './dto/update-slot.dto';
@Controller('slots')
@UseGuards(JwtAuthGuard,RolesGuard)
export class SlotController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post('restock')
  @Roles('admin','manager','staff')
  async restock(@Body() dto: RestockSlotDto) {
    return this.slotsService.restockSlot(dto);
  }

  @Post('create')
  @Roles('admin','manager')
  async create(@Body() dto: CreateSlotDto) {
    return this.slotsService.createSlot(dto);
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  async update(@Param('id') id: string, @Body() dto: UpdateSlotDto) {
    return this.slotsService.updateSlot(id, dto);
  }

  @Get('machine/:machineId')
  async getSlots(@Param('machineId') machineId: string) {
    return this.slotsService.getSlotsByMachine(machineId);
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  async delete(@Param('id') id: string) {
    return this.slotsService.deleteSlot(id);
  }

  @Get('machine/:machineId/inventory')
  async getInventory(@Param('machineId') machineId: string) {
    return this.slotsService.getInventory(machineId);
  }
}
