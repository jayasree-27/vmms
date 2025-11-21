import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MachineStatus } from '../machine.entity';

export class UpdateMachineDto {
  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsEnum(MachineStatus)
  @IsOptional()
  status?: MachineStatus;
}
