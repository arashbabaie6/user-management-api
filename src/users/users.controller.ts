import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

// Custom Decorators
import { JsonApiResponse } from 'src/common/decorators/api.decorators';
import { ProtectedRoute } from 'src/common/decorators/protected-route.decorator';
import { User } from 'src/common/decorators/user.decorator';

// Services
import { UsersService } from './users.service';

// DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto, UserEmailDto } from './dto/user.dto';
import { UserPaginationDto } from 'src/common/dtos/pagination.dto';

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
  @ProtectedRoute('ADMIN')
  @JsonApiResponse([UserDto])
  async findAll(@Query() paginationDto?: UserPaginationDto) {
    return await this.usersService.findAll(paginationDto);
  }

  @Patch(':email')
  @ProtectedRoute('ADMIN', 'USER')
  @JsonApiResponse(UserDto)
  async update(
    @User() currentUser: UserDto,
    @Body() updateUserDto: UpdateUserDto,
    @Param() params: UserEmailDto,
  ) {
    if (currentUser.role === 'ADMIN' || params.email === currentUser.email) {
      return await this.usersService.update(params.email, updateUserDto);
    }

    throw new ForbiddenException(
      'Please insert your current email in params section',
    );
  }

  @Delete(':email')
  @ProtectedRoute('ADMIN')
  @JsonApiResponse(UserDto)
  async remove(@User() currentUser: UserDto, @Param() params: UserEmailDto) {
    if (currentUser.email === params.email) {
      throw new ForbiddenException('You can not delete yourself!');
    }
    return await this.usersService.remove(params.email);
  }

  @Get('detail')
  @ProtectedRoute('ADMIN', 'USER')
  @JsonApiResponse(UserDto)
  async findOne(@User() currentUser: UserDto) {
    return await this.usersService.findOne(currentUser.id);
  }
}
