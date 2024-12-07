import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { $Enums } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ readOnly: true })
  email: string;
  
  @ApiProperty({ readOnly: true })
  role?: $Enums.Role;
}
