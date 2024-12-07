import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

// User Attributes class
export class UserAttributes {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: string;

  @ApiProperty()
  password: string;
}

// User Data class 
export class UserDto {
  @ApiProperty({ default: 'user' })
  type: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  attributes: UserAttributes;
}

// Pagination class (can be reused)
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

// FindAllUserDto (combines data and pagination)
export class FindAllUserResponseDto {
  @ApiProperty({ isArray: true, type: UserDto })
  data: UserDto[];

  @ApiProperty()
  pagination: PaginationDto;
}