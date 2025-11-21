import { Controller, Get, Param } from '@nestjs/common';
import { BullMQService } from 'src/services/bullmq-services';

@Controller('jobs')
export class JobsController {
  constructor(private bullMQService: BullMQService) {}

  @Get(':id')
  async status(@Param('id') id: string) {
    return this.bullMQService.getJobStatus(id);
  }
}
