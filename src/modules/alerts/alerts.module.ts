import { Module } from "@nestjs/common";
import { AlertsController } from "./alert.controller";
import { RedisModule } from "src/config/config.module";
import { RolesGuard } from "src/common/guards/role.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [RedisModule],
  controllers: [AlertsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AlertsModule {}
