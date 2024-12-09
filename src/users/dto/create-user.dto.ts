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
import { ExposeApiProperty } from 'src/common/decorators/api.decorators';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ExposeApiProperty({ example: 'yourEmail@email.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ExposeApiProperty({ example: 'yourpassword' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ExposeApiProperty({ example: 'Arash' })
  name: string;

  @IsOptional()
  @IsEnum(Role)
  @ExposeApiProperty({ default: Role.USER, enum: Role })
  role: Role;
}