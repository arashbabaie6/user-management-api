import { ApiProperty, OmitType} from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { UserDto } from 'src/users/dto/user.dto';

import { ExposeApiProperty } from 'src/common/decorators/api.decorators';

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

export class LoginUserDto extends OmitType(UserDto, ['access_token'] as const) {
  @ExposeApiProperty()
  access_token: string;
}