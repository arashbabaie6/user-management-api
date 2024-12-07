import { $Enums, Role, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
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
  access_token: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;

}
