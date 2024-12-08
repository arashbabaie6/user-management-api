import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { LoginDto, LoginResponseDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }
}