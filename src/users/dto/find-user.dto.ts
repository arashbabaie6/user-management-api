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
  @ApiProperty({ default: 1 })
  currentPage: number;

  @ApiProperty({ default: 2 })
  perPage: number;

  @ApiProperty({ default: 10 })
  totalItems: number;

  @ApiProperty({ default: 5 })
  totalPages: number;

  @ApiProperty({ default: true })
  hasNextPage: boolean;
}

// FindAllUserDto (combines data and pagination)
export class FindAllUserResponseDto {
  @ApiProperty({ isArray: true, type: UserDto })
  data: UserDto[];

  @ApiProperty()
  pagination: PaginationDto;
}