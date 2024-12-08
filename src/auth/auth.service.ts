import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from './../prisma/prisma.service';

import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  incorrectInput() {
    throw new UnauthorizedException('Email or password is incorrect');
  }

  async login(email: string, password: string): Promise<{ data: UserEntity }> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      this.incorrectInput()
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      this.incorrectInput()
    }

    user.access_token = this.jwtService.sign({ userId: user.id });
    return { data: user };
  }
}