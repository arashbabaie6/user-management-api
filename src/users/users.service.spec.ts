import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


jest.mock('src/common/utils/create-hash.utils', () => ({
  default: jest.fn().mockResolvedValue('hashedPassword'),
}));


const mockUser = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashedPassword',
  role: 'USER',

};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue(mockUser),
              findMany: jest.fn().mockResolvedValue([mockUser]),
              count: jest.fn().mockResolvedValue(1),
              findUniqueOrThrow: jest.fn().mockResolvedValue(mockUser),
              update: jest.fn().mockResolvedValue(mockUser),
              delete: jest.fn().mockResolvedValue(mockUser),
            },
            $transaction: jest.fn().mockResolvedValue([
              [mockUser],
              1,
            ]),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'testpassword',
        role: 'USER',
      };
      const createdUser = await service.create(createUserDto);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { ...createUserDto, password: 'hashedPassword' },
      });
      expect(createdUser).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return a list of users with pagination metadata', async () => {
      const pagination = { page: 1, perPage: 10 };
      const result = await service.findAll(pagination);

      expect(result).toEqual({
        data: [mockUser],
        meta: {
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should retrieve a user by ID', async () => {
      const foundUser = await service.findOne(1);

      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(foundUser).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user with a hashed password if provided', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        password: 'newpassword',
      };
      const updatedUser = await service.update('test@example.com', updateUserDto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        data: { ...updateUserDto, password: 'hashedPassword' },
      });
      expect(updatedUser).toEqual(mockUser);
    });

    it('should update a user without modifying the password if not provided', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',

      };
      const updatedUser = await service.update('test@example.com', updateUserDto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        data: updateUserDto,
      });
      expect(updatedUser).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should delete a user by email', async () => {
      const deletedUser = await service.remove('test@example.com');

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(deletedUser).toEqual(mockUser);
    });
  });
});