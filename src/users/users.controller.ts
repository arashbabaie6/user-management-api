import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersTransformer } from './users.transformer'; 
import { FindAllUserResponseDto, UserAttributesEmailDto, UserDto } from './dto/find-user.dto';

import decoratorConstant from './users.decorator.constant'
import { UserEntity } from './entities/user.entity';

@Controller('users')
  @ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity, description: 'Created user response' })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Get()
  @ApiQuery(decoratorConstant.apiQuery.perPage)
  @ApiQuery(decoratorConstant.apiQuery.page)
  @ApiOkResponse({ type: FindAllUserResponseDto, description: 'List of all users' })
  async findAll(
    @Query('page') page = decoratorConstant.apiQuery.page.default,
    @Query('perPage') perPage = decoratorConstant.apiQuery.perPage.default,
  ) {
    const pagination = { page: +page, perPage: +perPage };
    const { users, totalCount } = await this.usersService.findAll(pagination);
    return UsersTransformer.toJSONAPICollection({ users, totalCount, ...pagination });
  }

  @Get(':email')
  @ApiOkResponse({ type: UserDto, description: 'User details' })
  async findOne(@Param() params: UserAttributesEmailDto) {
    return await this.usersService.findOne(params.email);
  }

  @Patch(':email')
  @ApiOkResponse({ type: UserDto, description: 'User details' })
  async update(@Param() params: UserAttributesEmailDto, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(params.email, updateUserDto);
  }

  @Delete(':email')
  @ApiOkResponse({ type: UserDto, description: 'User details' })
  async remove(@Param() params: UserAttributesEmailDto) {
    return await this.usersService.remove(params.email);
  }
}
