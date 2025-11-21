import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { MachineStatus } from '../machine.entity';

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @IsEnum(MachineStatus)
  status?: MachineStatus;
}
