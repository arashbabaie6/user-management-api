import { $Enums, Role, User } from '@prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserDto implements User {
  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 'admin@leovegas.com' })
  email: string;

  @ApiProperty({ example: 'yourname' })
  name: string;

  @ApiProperty({ example: Role.ADMIN })
  role: $Enums.Role;

  access_token: string;
  
  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}