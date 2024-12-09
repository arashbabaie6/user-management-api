import { ApiHideProperty } from '@nestjs/swagger';
import { $Enums, Role, User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ExposeApiProperty } from 'src/common/decorators/api.decorators';

export class UserDto {
  @ExposeApiProperty({ example: 12 })
  id: number;

  @ExposeApiProperty({ example: 'admin@leovegas.com' })
  email: string;

  @ExposeApiProperty({ example: 'yourname' })
  name: string;

  @ExposeApiProperty({ example: Role.ADMIN })
  role: $Enums.Role;

  access_token: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @ExposeApiProperty()
  email: string;
}