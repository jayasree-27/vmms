import { IsUUID, IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdateSlotDto {
  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  slotNumber?: number;

  @IsOptional()
  @IsInt()
  stockQuantity?: number;
}
