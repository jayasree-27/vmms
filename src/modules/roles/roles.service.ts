import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dtos/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private repo: Repository<Role>
  ) {}

  create(dto: CreateRoleDto) {
    const role = this.repo.create(dto);
    return this.repo.save(role);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async delete(id: string) {
    const role = await this.findOne(id);
    return this.repo.remove(role);
  }
}
