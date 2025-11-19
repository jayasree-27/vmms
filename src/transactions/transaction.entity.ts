import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Product } from 'src/product/product.entity';
import { Slot } from 'src/slot/slot.entity';
import { Machine } from 'src/machine/machine.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Machine, { nullable: false, eager: true })
  machine: Machine;

  @ManyToOne(() => Slot, { nullable: false, eager: true })
  slot: Slot;

  @ManyToOne(() => Product, { nullable: false, eager: true })
  product: Product;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  amountPaid: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  changeGiven: string;

  @CreateDateColumn()
  createdAt: Date;
}
