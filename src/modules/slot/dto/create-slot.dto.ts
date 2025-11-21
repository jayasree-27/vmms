import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class CreateSlotDto {
  @IsUUID()
  machineId: string;

  @IsUUID()
  productId: string;

  @IsInt()
  stockQuantity: number;

  @IsInt()
  @Min(1)
  @Max(10)
  slotNumber: number;
}
