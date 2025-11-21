import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Slot } from './entitites/slot.entity';
import { Machine } from 'src/modules/machine/machine.entity';
import { RestockSlotDto } from './dto/restock-slot.dto';
import { CreateSlotDto } from './dto/create-slot.dto';
import { Product } from 'src/modules/product/product.entity';
import { UpdateSlotDto } from './dto/update-slot.dto';
@Injectable()
export class SlotsService {
  private readonly MAX_STOCK = 10;

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Slot)
    private slotRepo: Repository<Slot>,
    @InjectRepository(Machine)
    private machineRepo: Repository<Machine>,
  ) { }

  async createSlot(dto: CreateSlotDto) {
    const { machineId, productId, slotNumber, stockQuantity } = dto;

    return this.dataSource.transaction(async (manager) => {
      const machine = await manager.findOne(Machine, {
        where: { id: machineId },
      });
      if (!machine) {
        throw new NotFoundException('Machine not found');
      }

      const product = await manager.findOne(Product, {
        where: { id: productId },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const exsitingSlot = await manager.findOne(Slot, {
        where: { machine: { id: machineId }, slotNumber },
      });
      if (exsitingSlot) {
        throw new BadRequestException(
          `Slot ${slotNumber} is assigned. USe stock instead.`,
        );
      }

      const slot = manager.create(Slot, {
        machine,
        product,
        stockQuantity,
        slotNumber,
      });

      return manager.save(slot);
    });
  }

  async restockSlot(dto: RestockSlotDto) {
    const { machineId, slotNumber, quantityToAdd } = dto;

    return this.dataSource.transaction(async (manager) => {
      const machine = await manager.findOne(Machine, {
        where: { id: machineId },
      });

      if (!machine) {
        throw new NotFoundException('Machine not found');
      }

      const slot = await manager.findOne(Slot, {
        where: { machine: { id: machineId }, slotNumber },
        relations: ['machine', 'product'],
      });

      if (!slot) {
        throw new NotFoundException(
          `Slot ${slotNumber} not found in machine ${machineId}`,
        );
      }

      const newStock = slot.stockQuantity + quantityToAdd;

      if (newStock > this.MAX_STOCK) {
        throw new BadRequestException(
          `Cannot add ${quantityToAdd}. Slot max stock is ${this.MAX_STOCK}. Current : ${slot.stockQuantity}`,
        );
      }

      slot.stockQuantity = newStock;
      await manager.save(Slot, slot);

      return {
        slotId: slot.id,
        slotNumber: slot.slotNumber,
        stockQuantity: slot.stockQuantity,
        product: slot.product
          ? {
            id: slot.product.id,
            name: slot.product.name,
            price: slot.product.price,
            category: slot.product.category,
          }
          : null,
      };
    });
  }

  async getSlotsByMachine(machineId: string) {
    return this.slotRepo.find({
      where: { machine: { id: machineId } },
      relations: ['product'],
      order: { slotNumber: 'ASC' },
    });
  }

  async deleteSlot(id: string) {
    const slot = await this.slotRepo.findOne({ where: { id } });
    if (!slot) throw new NotFoundException('Slot not found');
    await this.slotRepo.remove(slot);

    return { message: 'Slot deleted successfully' };
  }

  async updateSlot(id: string, dto: UpdateSlotDto) {
  return this.dataSource.transaction(async manager => {
    const slot = await manager.findOne(Slot, {
      where: { id },
      relations: ['machine', 'product'],
    });

    if (!slot) throw new NotFoundException('Slot not found');

    // update product
    if (dto.productId) {
      const product = await manager.findOne(Product, {
        where: { id: dto.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      slot.product = product;
    }

    // update slot number
    if (dto.slotNumber) {
      const exists = await manager.findOne(Slot, {
        where: {
          machine: { id: slot.machine.id },
          slotNumber: dto.slotNumber,
        },
      });

      if (exists) {
        throw new BadRequestException(
          `Slot number ${dto.slotNumber} already exists in this machine`
        );
      }

      slot.slotNumber = dto.slotNumber;
    }

    // update stock
    if (dto.stockQuantity !== undefined) {
      if (dto.stockQuantity < 0 || dto.stockQuantity > slot.maxCapacity) {
        throw new BadRequestException(
          `Stock must be between 0 and ${slot.maxCapacity}`
        );
      }
      slot.stockQuantity = dto.stockQuantity;
    }

    return manager.save(slot);
  });
}

async getInventory(machineId: string) {
  const slots = await this.slotRepo.find({
    where: { machine: { id: machineId } },
    relations: ['product'],
    order: { slotNumber: 'ASC' },
  });

  return slots.map(s => ({
    slotNumber: s.slotNumber,
    stock: s.stockQuantity,
    product: s.product
      ? {
          id: s.product.id,
          name: s.product.name,
          price: s.product.price,
          category: s.product.category?.name,
        }
      : null,
  }));
}


}
