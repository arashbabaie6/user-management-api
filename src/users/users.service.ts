import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import createHash from 'src/common/utils/create-hash.utils';
import { UserDto } from './dto/user.dto';

interface PaginationInfo {
  page?: number;
  perPage?: number;
}

interface Meta {
  totalItems: number;
  currentPage: number;
  totalPages: number;
}
export interface FindAllUsers {
  data: UserDto[];
  meta: Meta;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const hashedPassword = await createHash(createUserDto.password);
    const userData = { ...createUserDto, password: hashedPassword };

    return await this.prisma.user.create({ data: userData });
  }

  async findAll({
    page = 1,
    perPage = 10,
  }: PaginationInfo): Promise<FindAllUsers> {
    const skip = (page - 1) * perPage;
    const [users, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({ skip, take: perPage }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(totalCount / perPage);

    return {
      data: users,
      meta: { totalItems: totalCount, currentPage: page, totalPages },
    };
  }

  async findOne(id: number): Promise<UserDto> {
    return await this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  async update(email: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const userUpdatedData = { ...updateUserDto };

    if (updateUserDto.password) {
      const hashedPassword = await createHash(updateUserDto.password);
      userUpdatedData.password = hashedPassword;
    }

    return await this.prisma.user.update({
      where: { email },
      data: userUpdatedData,
    });
  }

  async remove(email: string): Promise<UserDto> {
    return await this.prisma.user.delete({ where: { email } });
  }
}
