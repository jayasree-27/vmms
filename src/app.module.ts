import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachinesModule } from './modules/machine/machine.module';
import { SlotsModule } from './modules/slot/slots.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permission.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeormConfig } from './config/typeorm.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject:[ConfigService],
      useFactory:typeormConfig,
    }),
    MachinesModule,
    SlotsModule,
    CategoryModule,
    ProductModule,
    PurchaseModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuthModule
  ],
})
export class AppModule {}
