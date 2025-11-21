import { RolePermission } from 'src/modules/permissions/entities/roles-permission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => RolePermission, rp => rp.role)
  permissions: RolePermission[];
}
