import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisProvider } from './config.provider';


@Module({
  imports: [ConfigModule],
  providers: [RedisProvider],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
