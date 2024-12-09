import { Transform, Type } from 'class-transformer';
import { ApiSchema, OmitType } from '@nestjs/swagger';
import { Type as ClassType } from '@nestjs/common';
import { ExposeApiProperty } from '../decorators/api.decorators';

export function JsonApiDtoFactory<T>(_dtoClass: ClassType<T> | [ClassType<T>]) {
  const isArray = Array.isArray(_dtoClass);
  const dtoClass: ClassType<T> = isArray ? _dtoClass[0] : _dtoClass;

  @ApiSchema({ name: `${dtoClass.name}Attributes` })
  class AttributesDto extends OmitType(dtoClass as ClassType, ['id', 'type']) {}

  @ApiSchema({ name: `${dtoClass.name}Data` })
  class DataDto {
    @ExposeApiProperty()
    id: string;

    @ExposeApiProperty()
    @Transform(({ obj }) => obj?.type || dtoClass.name)
    type: string;

    @ExposeApiProperty({ type: AttributesDto })
    @Type(() => AttributesDto)
    @Transform(({ obj }) => ({ ...obj, id: undefined, type: undefined }))
    attributes: AttributesDto;
  }

  @ApiSchema({ name: `${dtoClass.name}Meta` })
  class MetaDto {
    @ExposeApiProperty()
    totalItems: number;

    @ExposeApiProperty()
    totalPages: number;

    @ExposeApiProperty()
    currentPage: number;
  }

  if (isArray) {
    @ApiSchema({ name: `${dtoClass.name}ListJsonApi` })
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
    @ApiSchema({ name: `${dtoClass.name}JsonApi` })
    class JsonApiDto {
      @ExposeApiProperty({ type: DataDto })
      @Type(() => DataDto)
      @Transform(({ obj }) => obj)
      data: DataDto;
    }
    return JsonApiDto;
  }
}
