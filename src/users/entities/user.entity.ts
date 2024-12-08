import { $Enums, Role, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 'yourEmail@email.com' })
  email: string;

  @ApiProperty({ example: 'Arash' })
  name: string;

  @ApiProperty({ example: Role.USER })
  role: $Enums.Role;

  @ApiProperty({ example: 'yourpassword' })
  password: string;

  @ApiProperty()
  @Exclude()
  access_token: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
