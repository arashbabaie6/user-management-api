import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface FindAll {
  page: number;
  perPage: number;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
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
    return this.prisma.user.findUnique({ where: { email }});
  }

  update(email: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { email }, data: { name: updateUserDto.name, password: updateUserDto.password } })
  }

  remove(email: string) {
    return this.prisma.user.delete({ where: { email } })
  }
}
