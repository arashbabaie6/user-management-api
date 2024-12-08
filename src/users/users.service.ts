import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { roundsOfHashing } from './users.constant';
import { UserEntity } from './entities/user.entity';

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

  async findAll({ page, perPage }: FindAll): Promise<{ data: UserEntity[], paginationInformation: { totalCount: number, page: number, perPage: number } }> {
    const skip = (page - 1) * perPage;
    const [users, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({ skip, take: perPage }),
      this.prisma.user.count()
    ]);

    return { data: users, paginationInformation: { totalCount, page, perPage } }
  }

  async findOne(email: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { email } });
    return { data: user }
  }

  async findOneId(id: number) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });
    return { data: user }
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const hashedPassword = await this.hashPassword(updateUserDto.password)
    updateUserDto.password = hashedPassword;

    const user = await this.prisma.user.update({ where: { email }, data: { name: updateUserDto.name, password: updateUserDto.password } })
    return { data: user }
  }

  async remove(email: string) {
    const user = await this.prisma.user.delete({ where: { email } })
    return { data: user }
  }
}
