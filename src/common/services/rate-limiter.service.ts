import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';

@Injectable()
export class LoginRateLimiterService {
  private readonly MAX_ATTEMPTS = 3; // max failed login attempts
  public readonly BLOCK_DURATION = 2 * 60 * 60; // 2 hours in seconds

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async isBlocked(email: string): Promise<boolean> {
    const attempts = await this.redis.get(`login_fail:${email}`);
    return attempts !== null && parseInt(attempts) >= this.MAX_ATTEMPTS;
  }

  async recordFailedAttempt(email: string) {
    const attempts = await this.redis.incr(`login_fail:${email}`);
    if (attempts === 1) {
      await this.redis.expire(`login_fail:${email}`, this.BLOCK_DURATION);
    }
  }

  async resetAttempts(email: string) {
    await this.redis.del(`login_fail:${email}`);
  }
}
