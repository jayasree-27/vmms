import { ConfigService } from '@nestjs/config';

export const redisConfig = async (config: ConfigService) => {
  return {
    host: config.get('REDIS_HOST'),
    port: config.get('REDIS_PORT'),
  };
};
