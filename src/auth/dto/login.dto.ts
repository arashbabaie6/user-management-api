import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ExposeApiProperty } from 'src/common/decorators/api.decorators';
import { UserDto } from 'src/users/dto/user.dto';

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