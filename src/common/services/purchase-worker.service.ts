import { Inject, Injectable, Logger } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { DataSource } from 'typeorm';
import { Slot } from 'src/modules/slot/entitites/slot.entity';
import { Transaction } from 'src/modules/transactions/transaction.entity';

@Injectable()
export class PurchaseWorkerService {
  private worker: Worker;
  private readonly logger = new Logger(PurchaseWorkerService.name);
  private readonly LOW_STOCK_THRESHOLD = 3;

  constructor(
    private dataSource: DataSource,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {
    this.worker = new Worker(
      'PURCHASE_QUEUE',
      async (job: Job) => await this.processPurchase(job),
      {
        connection: this.redis,
      },
    );

    this.worker.on('completed', (job: Job) => {
      this.logger.log(`Job ${job.id} completed`);
    });

    this.worker.on('failed', (job: Job) => {
      this.logger.error(`Job ${job.id} failed: ${job.failedReason}`);
    });
  }

  async processPurchase(job: Job) {
    const { machineId, slotNumber, paymentAmount } = job.data as {
      machineId: string;
      slotNumber: number;
      paymentAmount: number;
    };

    return this.dataSource.transaction(async (manager) => {
      const slot = await manager.findOne(Slot, {
        where: {
          machine: { id: machineId },
          slotNumber,
        },
        relations: ['product', 'machine'],
      });

      if (!slot) {
        throw new Error('Slot not found');
      }

      if (slot.stockQuantity <= 0) {
        throw new Error('Slot is empty');
      }

      const product = slot.product;
      if (!product) {
        throw new Error('Product not found');
      }

      const price = parseFloat((product.price as unknown as string) || '0');
      if (paymentAmount < price) {
        throw new Error('Insufficient funds');
      }

      slot.stockQuantity = slot.stockQuantity - 1;
      await manager.save(slot);

      const change = +(paymentAmount - price).toFixed(2);

      const tx = manager.create(Transaction, {
        machine: slot.machine,
        product,
        slot,
        purchasePrice: price,
        paymentMethod: 'cash',
        transactionStatus: 'success',
      });

      await manager.save(tx);

      if (slot.stockQuantity < this.LOW_STOCK_THRESHOLD) {
        const alert = {
          id: `${slot.machine.id}::slot:${slot.slotNumber}`,
          machineId: slot.machine.id,
          slotId: slot.id,
          slotNumber: slot.slotNumber,
          productId: slot.product.id,
          productName: slot.product.name,
          stockQuantity: slot.stockQuantity,
          createdAt: new Date().toISOString(),
        };

        await this.redis.lpush('vmms:low_stock_alerts', JSON.stringify(alert));
        await this.redis.set(
          `vmms:low_stock_alerts:${alert.machineId}:${alert.slotNumber}`,
          JSON.stringify(alert),
        );
      }

      return {
        transactionId: tx.id,
        productId: product.id,
        productName: product.name,
        reaminingStock: slot.stockQuantity,
        changeGiven: change.toFixed(2),
      };
    });
  }

  async onModuleDestroy() {
    await this.worker.close();
  }
}
