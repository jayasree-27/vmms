import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryColumn()
  roleId: string;

  @PrimaryColumn()
  permissionId: string;

  @ManyToOne(() => Permission, perm => perm.rolePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;

  @ManyToOne(() => Role, role => role.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

}
