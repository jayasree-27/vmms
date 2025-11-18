import { Entity, PrimaryGeneratedColumn, CreateDateColumn,UpdateDateColumn,Column, OneToMany } from 'typeorm';
import { Slot } from 'src/slot/slot.entity';

export enum MachineStatus {
    ACTIVE = 'ACTIVE',
    OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

@Entity('machines')
export class Machine {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        type: 'text',
    })
    location: string;

    @Column({
        type: 'varchar',
        unique: true,
    })
    serialNumber: string;

    @OneToMany(() => Slot, (slot) => slot.machine)
    slots: Slot[]

    @Column({
        type: 'enum',
        enum: MachineStatus,
        default: MachineStatus.ACTIVE
    })
    status: MachineStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}