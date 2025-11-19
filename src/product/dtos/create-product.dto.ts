import { IsString, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsUUID()
  categoryId: string;
}
