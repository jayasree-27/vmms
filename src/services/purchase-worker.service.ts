import { Injectable, Logger } from "@nestjs/common";
import { Worker, Job } from "bullmq";
import Redis from 'ioredis';
import { DataSource } from "typeorm";
import { Slot } from "src/slot/slot.entity";
import { Product } from "src/product/product.entity";
import { Transaction } from "src/transactions/transaction.entity";
import { Machine } from "src/machine/machine.entity";

@Injectable()
export class PurchaseWorkerService {
    private worker: Worker;
    private redis: Redis;
    private readonly logger = new Logger(PurchaseWorkerService.name);
    private readonly LOW_STOCK_THRESHOLD = 2;

    constructor(private dataSource: DataSource) {
        const redisOptions = {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: +(process.env.REDIS_PORT || 6379),
            maxRetriesPerRequest: null,
            enableReadyCheck: false
        };
        this.redis = new Redis(redisOptions);

        this.worker = new Worker(
            'PURCHASE_QUEUE',
            async (job: Job) => await this.processPurchase(job),
            {
                connection: this.redis
            }
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
            machineId: string,
            slotNumber: number,
            paymentAmount: number
        };

        return this.dataSource.transaction(async (manager) => {
            const slot = await manager.findOne(Slot, {
                where: {
                    machine: { id: machineId },
                    slotNumber
                },
                relations: ['product', 'machine']
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
                amountPaid: paymentAmount,
                changeGiven: change.toFixed(2)
            });

            await manager.save(tx);

            if(slot.stockQuantity < this.LOW_STOCK_THRESHOLD){
                const alert={
                    id:`${slot.machine.id}::slot:${slot.slotNumber}`,
                    machineId:slot.machine.id,
                    slotId:slot.id,
                    slotNumber:slot.slotNumber,
                    productId:slot.product.id,
                    productName:slot.product,
                    stockQuantity:slot.stockQuantity,
                    createdAt: new Date().toISOString(),
                };

                await this.redis.lpush('vmms:low_stock_alerts',JSON.stringify(alert));
                await this.redis.set(`vmms:low_stock_alerts:${alert.machineId}:${alert.slotNumber}`,JSON.stringify(alert));
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
