import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, SerializeOptions, UseInterceptors, ClassSerializerInterceptor, Request, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JsonApiResponse } from 'src/common/decorators/api.decorators';

// Users
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto, UserEmailDto } from './dto/user.dto';

// Authentication
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard'; 
import { Roles } from 'src/auth/roles.decorator';

// Constants
import { decoratorConstant } from './users.constant'

@Controller('users')
  @ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @JsonApiResponse(UserDto)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiQuery(decoratorConstant.apiQuery.perPage)
  @ApiQuery(decoratorConstant.apiQuery.page)
  @JsonApiResponse([UserDto])
  async findAll(
    @Query('page') page = decoratorConstant.apiQuery.page.default,
    @Query('perPage') perPage = decoratorConstant.apiQuery.perPage.default,
  ) {
    const pagination = { page: +page, perPage: +perPage };
    return await this.usersService.findAll(pagination);
  }

  @Patch(':email')
  @Roles('ADMIN', 'USER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @JsonApiResponse(UserDto)
  async update(@Req() request, @Body() updateUserDto: UpdateUserDto, @Param() params: UserEmailDto) {
    if (request.user.role === 'ADMIN') {
      return await this.usersService.update(params.email, updateUserDto);
    }
    if (params.email === request.user.emai) {
      return await this.usersService.update(request.user.email, updateUserDto);
    }

    throw new HttpException('Please insert your current email in params section.', HttpStatus.FORBIDDEN);
  }

  @Delete(':email')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @JsonApiResponse(UserDto)
  async remove(@Req() request, @Param() params: UserEmailDto) {
    if (request.user.email === params.email) {
      throw new HttpException('You can not delete yourself!', HttpStatus.FORBIDDEN);
    }
    return await this.usersService.remove(params.email);
  }

  @Get('detail')
  @Roles('ADMIN', 'USER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @JsonApiResponse(UserDto)
  // TODO add type for request
  async findOne(@Req() request) {
    return await this.usersService.findOne(request.user.id);
  }

}
