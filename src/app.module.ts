import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachinesModule } from './modules/machine/machine.module';
import { SlotsModule } from './modules/slot/slots.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigService } from '@nestjs/config';
import { typeormConfig } from './config/typeorm.config';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RedisModule } from './config/config.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:typeormConfig,
    }),
    MachinesModule,
    SlotsModule,
    CategoryModule,
    ProductModule,
    PurchaseModule,
    UsersModule,
    AuthModule,
    RedisModule
  ],
  // providers:[
  //   {
  //     provide:'APP_GUARD',
  //     useClass:JwtAuthGuard
  //   },
  //   {
  //     provide:'ROLE_GUARD',
  //     useClass:RolesGuard
  //   }
  // ]
})
export class AppModule {}
