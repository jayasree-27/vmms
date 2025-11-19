import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from '../machine.entity';
import { CreateMachineDto } from '../dto/create-machine.dto';
import { Slot } from 'src/slot/slot.entity';

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,
    @InjectRepository(Slot)
    private readonly slotRepo: Repository<Slot>,
  ) {}

  async create(dto: CreateMachineDto) {
    const machine = this.machineRepo.create(dto);
    return this.machineRepo.save(machine);
  }

  async findById(id: string) {
    const machine = await this.machineRepo.findOne({ where: { id } });
    if (!machine) {
      throw new NotFoundException('machine is not found');
    }
    return machine;
  }

  async getInventory(machineId: string) {
    const machine = await this.machineRepo.findOne({
      where: { id: machineId },
    });
    if (!machine) {
      throw new NotFoundException('machine is not found');
    }

    const slots = await this.slotRepo.find({
      where: { machine: { id: machineId } },
      relations: ['product', 'product.category'],
      order: { slotNumber: 'ASC' },
    });

    return slots.map((s) => ({
      slotId: s.id,
      slotNumber: s.slotNumber,
      stockQuantity: s.stockQuantity,
      product: s.product
        ? {
            id: s.product.id,
            name: s.product.name,
            price: s.product.price,
            category: s.product.category,
          }
        : null,
    }));
  }
}
