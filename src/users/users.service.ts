import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { roundsOfHashing } from './users.constant';

interface FindAll {
  page: number;
  perPage: number;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async hashPassword(password) {
    return await bcrypt.hash(
      password,
      roundsOfHashing,
    );
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password)
    createUserDto.password = hashedPassword;
    return this.prisma.user.create({ data: createUserDto });
  }

  async findAll({ page, perPage }: FindAll) {
    const skip = (page - 1) * perPage;

    const [users, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({ skip, take: perPage }),
      this.prisma.user.count()
    ]);

    return { users, totalCount }
  }

  findOne(email: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { email } });
  }

  findOneId(id: number) {
    return this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const hashedPassword = await this.hashPassword(updateUserDto.password)
    updateUserDto.password = hashedPassword;

    return this.prisma.user.update({ where: { email }, data: { name: updateUserDto.name, password: updateUserDto.password } })
  }

  remove(email: string) {
    return this.prisma.user.delete({ where: { email } })
  }
}
