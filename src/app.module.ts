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
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Jayasree275',
      database: 'vmms',
      autoLoadEntities: true,
      synchronize: true,
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
