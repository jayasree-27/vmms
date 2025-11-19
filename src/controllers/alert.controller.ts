import { Controller, Get } from '@nestjs/common';
import Redis from 'ioredis';

@Controller('redis')
export class AlertsController{
    private redis: Redis;

    constructor(){
        this.redis = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: +(process.env.REDIS_PORT || 6379)
        });
    }

    @Get()
    async getAlerts(){
        const items=await this.redis.lrange('vmms:low_stock_alerts',0,100);
        const alerts=items.map((s)=>{
            try{
                return JSON.parse(s);   
            }
            catch{
                return s;
            }
        });
        return alerts;
    }
}