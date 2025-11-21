import { BullRootModuleOptions } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

export const bullConfig = (
  configService: ConfigService,
): BullRootModuleOptions => ({
  redis: {
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
  },
});
