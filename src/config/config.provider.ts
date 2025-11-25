import { Inject, Provider } from "@nestjs/common";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";

export const RedisProvider: Provider = {
    provide: 'REDIS_CLIENT',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return new Redis({
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        })
    }
}