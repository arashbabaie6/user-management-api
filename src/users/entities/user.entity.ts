import { $Enums, Role, User } from '@prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 'yourEmail@email.com' })
  email: string;

  @ApiProperty({ example: 'yourname' })
  name: string;

  @ApiProperty({ example: Role.USER })
  role: $Enums.Role;

  @ApiProperty({ example: 'yourpassword' })
  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiHideProperty()
  @Exclude()
  access_token: string;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
