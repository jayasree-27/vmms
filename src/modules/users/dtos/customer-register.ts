import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CustomerRegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  firstName: string;
}
