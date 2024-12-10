import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

import { ExposeApiProperty } from '../decorators/api.decorators';

export class UserPaginationDto {
  @ExposeApiProperty({
    default: 1,
    example: 1,
    description: 'Current page number',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ExposeApiProperty({
    example: 10,
    default: 10,
    description: 'Number of items per page',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  perPage?: number;
}