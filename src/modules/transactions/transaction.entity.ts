import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Product } from 'src/modules/product/product.entity';
import { Slot } from 'src/modules/slot/entitites/slot.entity';
import { Machine } from 'src/modules/machine/machine.entity';

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
    default: 0,
  })
  purchasePrice: number;

  @Column({ type: 'varchar' })
  paymentMethod: string;

  @Column({ type: 'varchar' })
  transactionStatus: string;

  @CreateDateColumn({ type: 'timestamptz' })
  transactionTime: Date;
}
