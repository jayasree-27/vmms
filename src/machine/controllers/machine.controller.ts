import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MachineService } from '../services/machine.service';
import { CreateMachineDto } from '../dto/create-machine.dto';
import { BullMQService } from 'src/services/bullmq-services';
import { PurchaseDto } from 'src/purchase/dtos/purchase.dto';
import { stat } from 'fs';
@Controller('machines')
export class MachineController {
  constructor(
    private readonly machineService: MachineService,
    private readonly bullMQService: BullMQService
  ) { }

  @Post()
  async create(@Body() dto: CreateMachineDto) {
    const machine = await this.machineService.create(dto);
    return machine;
  }

  @Get(':id/inventory')
  async getInventory(@Param('id') id: string) {
    return this.machineService.getInventory(id);
  }

  @Post(':machineId/purchase')
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