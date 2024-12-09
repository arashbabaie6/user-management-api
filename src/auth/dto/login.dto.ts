import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { UserAttributesDto, UserDto } from 'src/users/dto/find-user.dto';

// Utils class
class LoginUserAttributesDto extends UserAttributesDto {
  @ApiProperty()
  accessToken: string;
}

class LoginUserDto extends PartialType(
  OmitType(UserDto, ['attributes'] as const),

) {
  @ApiProperty()
  attributes: LoginUserAttributesDto
}

// Exported class
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'admin@leovegas.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ example: 'admin1234' })
  password: string;
}

export class LoginResponseDto {
  
  data: LoginUserDto
}
