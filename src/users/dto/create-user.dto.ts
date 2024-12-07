import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ readOnly: true })
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, default: Role.USER, enum: Role, readOnly: true })
  role?: Role = 'USER';
}