import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersTransformer } from './users.transformer'; 
import { ApiQuery } from '@nestjs/swagger';

const DEFAULT_PER_PAGE = 2;
const DEFAULT_PAGE = 1;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiQuery({
    name: 'perPage',
    description: 'Items per page',
    type: Number,
    required: false,
    default: DEFAULT_PER_PAGE
  })
  @ApiQuery({
    name: 'page',
    description: 'Current Page',
    type: Number,
    required: false,
    default: DEFAULT_PAGE
  })
  async findAll(
    @Query('page') page = DEFAULT_PAGE,
    @Query('perPage') perPage = DEFAULT_PER_PAGE,
  ) {
    const pagination = { page: +page, perPage: +perPage };
    const { users, totalCount } = await this.usersService.findAll(pagination);
    return UsersTransformer.toJSONAPICollection({ users, totalCount, ...pagination });
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Patch(':email')
  update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(email, updateUserDto);
  }

  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.usersService.remove(email);
  }
}
