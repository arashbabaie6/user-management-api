import { Transform, Type } from 'class-transformer';
import { ApiSchema, OmitType } from '@nestjs/swagger';
import { Type as ClassType } from '@nestjs/common';
import { ExposeApiProperty } from '../decorators/api.decorators';

export function JsonApiDtoFactory<T>(_dtoClass: ClassType<T> | [ClassType<T>]) {
  const isArray = Array.isArray(_dtoClass);
  const dtoClass: ClassType<T> = isArray ? _dtoClass[0] : _dtoClass;

  class AttributesDto extends OmitType(dtoClass as ClassType, ['id', 'type']) { }

  class DataDto {
    @ExposeApiProperty()
    id: string;

    @ExposeApiProperty()
    @Transform(() => 'user')
    type: string;

    @ExposeApiProperty({ type: AttributesDto })
    @Type(() => AttributesDto)
    @Transform(({ obj }) => ({ ...obj, id: undefined, type: undefined }))
    attributes: AttributesDto;
  }

  class MetaDto {
    @ExposeApiProperty()
    totalItems: number;

    @ExposeApiProperty()
    totalPages: number;

    @ExposeApiProperty()
    currentPage: number;
  }

  if (isArray) {
    class JsonApiDto {
      @ExposeApiProperty({ type: [DataDto] })
      @Type(() => DataDto)
      data: DataDto[];

      @ExposeApiProperty({ type: MetaDto })
      @Type(() => MetaDto)
      meta: MetaDto[];
    }
    return JsonApiDto;
  } else {
    class JsonApiDto {
      @ExposeApiProperty({ type: DataDto })
      @Type(() => DataDto)
      @Transform(({ obj }) => obj)
      data: DataDto;
    }
    return JsonApiDto;
  }
}
