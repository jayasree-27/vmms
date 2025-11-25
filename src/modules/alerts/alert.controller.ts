import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import Redis from 'ioredis';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserRole } from 'src/modules/users/entities/user.entity';

@Controller('alerts')
export class AlertsController {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN,UserRole.MANAGER,UserRole.STAFF)
  async getAlerts() {
    const items = await this.redis.lrange('vmms:low_stock_alerts', 0, 100);
    const alerts = items.map((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return s;
      }
    });
    return alerts;
  }
}
