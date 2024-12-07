import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail
} from 'class-validator';

export class UserAttributesEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}

export class UserAttributesDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ enum: Role })
  role: string;

  @ApiProperty()
  email: UserAttributesEmailDto;

  @ApiProperty()
  password: string;
}

export class UserDto {
  @ApiProperty({ default: 'user' })
  type: string;

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

export class FindAllUserResponseDto {
  @ApiProperty({ isArray: true, type: UserDto })
  data: UserDto[];

  @ApiProperty()
  pagination: PaginationDto;
}