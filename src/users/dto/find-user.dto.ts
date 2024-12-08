import { Role } from '@prisma/client';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class UserAttributesEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'yourEmail@email.com' })
  email: string;
}

export class UserAttributesDto extends UserAttributesEmailDto {
  @ApiProperty({ example: 'yourname' })
  name: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  role: string;
}
  
@Exclude()
export class UserDto {
  @ApiProperty({ default: 'user' })
  type: string;

  @Expose()
  @ApiProperty()
  id: string;

  @ApiProperty()
  attributes: UserAttributesDto;
}

export class PaginationDto {
  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 2 })
  perPage: number;

  @ApiProperty({ example: 10 })
  totalItems: number;

  @ApiProperty({ example: 5 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;
}

export class UserResponseDto {
  @ApiProperty()
  data: UserDto;
}

export class FindAllUserResponseDto {
  @ApiProperty({ isArray: true, type: UserDto })
  data: UserDto[];

  @ApiProperty()
  pagination: PaginationDto;
}