import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/createUser.dto';
import { Role } from 'src/modules/roles/entities/role.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,

    @InjectRepository(Role)
    private rolesRepo: Repository<Role>,
  ) {}

  async create(dto: CreateUserDto) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const role = await this.rolesRepo.findOne({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException('Role not found');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      role,
    });

    return await this.usersRepo.save(user);
  }

  async findAll() {
    return this.usersRepo.find({ relations: ['role'] });
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({ where: { id }, relations: ['role'] });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } ,
      relations: ['role'] 
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (dto.roleId) {
      const role = await this.rolesRepo.findOne({ where: { id: dto.roleId } });
      if (!role) throw new NotFoundException('Role not found');
      user.role = role;
    }

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);

    return this.usersRepo.save(user);
  }

  async delete(id: string) {
    const user = await this.findOne(id);
    return this.usersRepo.remove(user);
  }
}
