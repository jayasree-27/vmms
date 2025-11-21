import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, QueueScheduler } from 'bullmq';

@Injectable()
export class BullMQService implements OnModuleDestroy {
  private purchaseQueue: Queue;
  private scheduler: QueueScheduler;

  private connection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: +(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  };

  constructor() {
    this.scheduler = new QueueScheduler('PURCHASE_QUEUE', {
      connection: this.connection,
    });

    this.purchaseQueue = new Queue('PURCHASE_QUEUE', {
      connection: this.connection,
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
