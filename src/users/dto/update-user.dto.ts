import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

import { ExposeApiProperty } from 'src/common/decorators/api.decorators';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @ExposeApiProperty()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @ExposeApiProperty()
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @ExposeApiProperty()
  name?: string;
}
