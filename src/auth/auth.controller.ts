import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { LoginDto, LoginUserDto } from './dto/login.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { JsonApiResponse } from 'src/common/decorators/api.decorators';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @JsonApiResponse(LoginUserDto)
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }
}