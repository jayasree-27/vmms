import { Machine } from 'src/modules/machine/machine.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('system_logs')
export class SystemLogs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  logLevel: string;

  @Column({ type: 'text' })
  message: string;

  @ManyToOne(() => Machine, { nullable: true })
  machine: Machine;

  @CreateDateColumn({ type: 'timestamptz' })
  logTime: Date;
}
