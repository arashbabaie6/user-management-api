import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersTransformer } from './users.transformer'; 
import { FindAllUserResponseDto } from './dto/find-user.dto';

import decoratorConstant from './users.decorator.constant'

@Controller('users')
  @ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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
  async findOne(@Param('email') email: string) {
    return await this.usersService.findOne(email);
  }

  @Patch(':email')
  async update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(email, updateUserDto);
  }

  @Delete(':email')
  async remove(@Param('email') email: string) {
    return await this.usersService.remove(email);
  }
}
