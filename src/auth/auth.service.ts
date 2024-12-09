import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from './../prisma/prisma.service';

import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  static incorrectInput() {
    throw new UnauthorizedException('Email or password is incorrect');
  }

  async login(email: string, password: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      AuthService.incorrectInput()
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      AuthService.incorrectInput()
    }

    user.access_token = this.jwtService.sign({ userId: user.id });
    return new UserDto(user);
  }
}