import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  private incorrectInput() {
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      this.incorrectInput()
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      this.incorrectInput()
    }

    const accessToken = this.jwtService.sign({ userId: user.id });
    
    return { ...user, access_token: accessToken }
  }
}