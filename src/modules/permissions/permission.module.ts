import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permission.service'
import { PermissionsController } from './permission.controller';
import { RolePermission } from './entities/roles-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission,RolePermission])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
