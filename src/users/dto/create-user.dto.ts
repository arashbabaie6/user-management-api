import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEmail,
  IsEnum
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'yourEmail@email.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ example: 'yourpassword' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ example: 'Arash' })
  name: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiProperty({ default: Role.USER, enum: Role })
  role: Role;
}