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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
