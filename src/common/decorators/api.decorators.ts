import { Type as ClassType, applyDecorators, SerializeOptions } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiProperty,
  ApiResponseNoStatusOptions,
  ApiPropertyOptions
} from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { JsonApiDtoFactory } from '../dtos/json-api.dto';

export function JsonApiResponse<T>(
  dtoClass: ClassType<T> | [ClassType<T>],
  options?: Omit<ApiResponseNoStatusOptions, 'type'>,
) {
  // const type = JsonApiDtoFactory(dtoClass);
  // Handle Controller decorators
  return applyDecorators(
    ApiOkResponse({ type: JsonApiDtoFactory(dtoClass) ,...options }),
    SerializeOptions({
      type: JsonApiDtoFactory(dtoClass),
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
    }),
  );
}

// Handle DTO decorator
export function ExposeApiProperty(options?: ApiPropertyOptions) {
  return applyDecorators(Expose(), ApiProperty(options));
}
