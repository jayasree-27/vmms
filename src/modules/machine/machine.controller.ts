import { Controller, Post, Get, Param, Body, UseGuards, Patch, Delete } from '@nestjs/common';
import { MachineService } from './machine.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { BullMQService } from 'src/services/bullmq-services';
import { PurchaseDto } from '../purchase/dtos/purchase.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UpdateMachineDto } from './dto/update-machine.dto';
@Controller('machines')
@UseGuards(JwtAuthGuard,RolesGuard)
export class MachineController {
  constructor(
    private readonly machineService: MachineService,
    private readonly bullMQService: BullMQService
  ) { }

  @Post()
  @Roles('admin','manager')
  async create(@Body() dto: CreateMachineDto) {
    const machine = await this.machineService.create(dto);
    return machine;
  }

  @Patch(':id')
  @Roles('Admin', 'Manager')
  async update(@Param('id') id: string, @Body() dto: UpdateMachineDto) {
    return this.machineService.update(id, dto);
  }

  @Delete(':id')
  @Roles('Admin', 'Manager')
  async delete(@Param('id') id: string) {
    return this.machineService.delete(id);
  }

  @Get(':id/inventory')
  @Roles('admin', 'manager')
  async getInventory(@Param('id') id: string) {
    return this.machineService.getInventory(id);
  }

  @Post(':machineId/purchase')
  @Roles('customer')
  async purchase(@Param('machineId') machineId: string, @Body() body: PurchaseDto) {
    const jobId = await this.bullMQService.addPurchaseJob({
      machineId,
      slotNumber: body.slotNumber,
      paymentAmount: body.amountPaid,
    });

    return {
      status: 'accepted',
      jobId,
      message: 'purchase job added to queue'
    }
  };
}