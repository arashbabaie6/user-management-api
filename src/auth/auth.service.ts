import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './../prisma/prisma.service';

import { AuthEntity } from './entity/auth.entity';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  incorrectInput() {
    throw new UnauthorizedException('Email or password is incorrect');
  }

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      this.incorrectInput()
    }

    const isPasswordValid = user.password === password;
    if (!isPasswordValid) {
      this.incorrectInput()
    }

    return {
      access_token: this.jwtService.sign({ userId: user.id }),
    };
  }
}