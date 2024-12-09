import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { roundsOfHashing } from '../common/constants/decorator.constant';

interface FindAll {
  page: number;
  perPage: number;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // TODO move to common
  async hashPassword(password) {
    return await bcrypt.hash(
      password,
      roundsOfHashing,
    );
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password)
    createUserDto.password = hashedPassword;
    const user = await this.prisma.user.create({ data: createUserDto });
    return user
  }

  async findAll({ page, perPage }: FindAll) {
    const skip = (page - 1) * perPage;
    const [users, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({ skip, take: perPage }),
      this.prisma.user.count()
    ]);

    return { data: users, meta: { totalItems: totalCount, currentPage: page, totalPages: perPage } }
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });
    return  user
  }

  async findOneId(id: number) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });
    return user
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hashedPassword = await this.hashPassword(updateUserDto.password)
      updateUserDto.password = hashedPassword;
    }

    const user = await this.prisma.user.update({ where: { email }, data: { ...updateUserDto } })
    return user
  }

  async remove(email: string) {
    const user = await this.prisma.user.delete({ where: { email } })
    return user
  }
}
