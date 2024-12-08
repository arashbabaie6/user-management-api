import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'admin@leovegas.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ example: 'admin1234' })
  password: string;
}