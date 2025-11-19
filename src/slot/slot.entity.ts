import {
  Entity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  Check,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Machine } from 'src/machine/machine.entity';
import { Product } from 'src/product/product.entity';

@Entity('slots')
@Unique(['machine', 'slotNumber'])
@Check(`"stockQuantity" >= 0 AND "stockQuantity" <= 10`)
@Check(`"slotNumber" >= 1 AND "slotNumber" <= 10`)
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Machine, (machine) => machine.slots, { onDelete: 'CASCADE' })
  machine: Machine;

  @ManyToOne(() => Product, (product) => product.slots, { eager: true })
  product: Product;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ type: 'int' })
  slotNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
