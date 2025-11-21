import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Slot } from './slot.entity';
import { CreateCategoryDto } from 'src/modules/category/dtos/create-category.dto';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('restocks')
export class Restock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Slot)
  slot: Slot;

  @ManyToOne(() => User)
  user:User;

  @Column()
  quantityAdded: number;

  @CreateDateColumn({ type: 'timestamptz' })
  restockTime: Date;
}
