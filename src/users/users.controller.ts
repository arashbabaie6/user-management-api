import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, SerializeOptions, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';

// Users
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserResponseDto, UserAttributesEmailDto, UserDto, UserResponseDto } from './dto/find-user.dto';

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
  @ApiCreatedResponse({ type: UserResponseDto, description: 'Created user response' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiQuery(decoratorConstant.apiQuery.perPage)
  @ApiQuery(decoratorConstant.apiQuery.page)
  @ApiOkResponse({ type: FindAllUserResponseDto, description: 'List of all users' })
  async findAll(
    @Query('page') page = decoratorConstant.apiQuery.page.default,
    @Query('perPage') perPage = decoratorConstant.apiQuery.perPage.default,
  ) {
    const pagination = { page: +page, perPage: +perPage };
    return await this.usersService.findAll(pagination);
  }

  @Get(':email')
  // @Roles('ADMIN')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiBearerAuth()
  // @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: UserDto })
  @ApiOkResponse({ type: UserResponseDto, description: 'User details' })
  async findOne(@Param() params: UserAttributesEmailDto) {
    return await this.usersService.findOne(params.email);
  }

  @Patch(':email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto, description: 'User details' })
  async update(@Param() params: UserAttributesEmailDto, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(params.email, updateUserDto);
  }

  @Delete(':email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto, description: 'User removed' })
  async remove(@Param() params: UserAttributesEmailDto) {
    return await this.usersService.remove(params.email);
  }
}
