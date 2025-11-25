import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, QueueScheduler } from 'bullmq';
import Redis from 'ioredis';

@Injectable()
export class BullMQService implements OnModuleDestroy {
  private purchaseQueue: Queue;
  private scheduler: QueueScheduler;
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {
    this.scheduler = new QueueScheduler('PURCHASE_QUEUE', {
      connection: this.redis,
    });

    this.purchaseQueue = new Queue('PURCHASE_QUEUE', {
      connection: this.redis,
    });
  }

  async addPurchaseJob(payload: any) {
    const job = await this.purchaseQueue.add('purchase', payload, {
      removeOnComplete: false,
      removeOnFail: false,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
    return job.id as string;
  }

  async getJobStatus(jobId: string) {
    const job = await this.purchaseQueue.getJob(jobId);

    if (!job) {
      return {
        id: jobId,
        status: 'not found',
      };
    }

    const state = await job.getState();
    return {
      id: job.id,
      name: job.name,
      data: job.data,
      state,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
      finishedOn: job.finishedOn,
      processedOn: job.processedOn,
    };
  }

  onModuleDestroy() {
    return this.scheduler?.close();
  }
}
