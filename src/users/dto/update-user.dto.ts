import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { $Enums } from '@prisma/client';
import { ExposeApiProperty } from 'src/common/decorators/api.decorators';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @ExposeApiProperty()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @ExposeApiProperty()
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @ExposeApiProperty()
  name?: string;
}
