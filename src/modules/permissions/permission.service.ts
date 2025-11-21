import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity'
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { RolePermission } from './entities/roles-permission.entity'
@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission) private repo: Repository<Permission>,
    @InjectRepository(RolePermission) private rolePermRepo: Repository<RolePermission>,
  ) {}

  create(dto: CreatePermissionDto) {
    const permission = this.repo.create(dto);
    return this.repo.save(permission);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const perm = await this.repo.findOne({ where: { id } });
    if (!perm) throw new NotFoundException('Permission not found');
    return perm;
  }

  async delete(id: string) {
    const perm = await this.findOne(id);
    return this.repo.remove(perm);
  }

  assign(roleId: string, permissionId: string) {
    const rp = this.rolePermRepo.create({ roleId, permissionId });
    return this.rolePermRepo.save(rp);
  }

  findAllPermissions() {
    return this.repo.find();
  }

  deletePermission(roleId: string, permissionId: string) {
    return this.rolePermRepo.delete({ roleId, permissionId });
  }

}
