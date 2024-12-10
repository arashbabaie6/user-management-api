import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto, UserEmailDto } from './dto/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser: UserDto = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
    access_token: 'mock_access_token',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            findAll: jest.fn().mockResolvedValue({
              data: [mockUser],
              meta: {
                totalItems: 1,
                currentPage: 1,
                totalPages: 1,
              },
            }),
            findOne: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(mockUser),
            remove: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'USER',
      };
      const result = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return a list of users with pagination metadata', async () => {
      const result = await controller.findAll({ page: 1, perPage: 10 });

      expect(usersService.findAll).toHaveBeenCalledWith({
        page: 1,
        perPage: 10,
      });
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

  describe('update', () => {
    it('should update a user (ADMIN role)', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated User' };
      const params: UserEmailDto = { email: 'test@example.com' };
      const currentUser: UserDto = { ...mockUser, role: 'ADMIN' };

      const result = await controller.update(
        currentUser,
        updateUserDto,
        params,
      );

      expect(usersService.update).toHaveBeenCalledWith(
        params.email,
        updateUserDto,
      );
      expect(result).toEqual(mockUser);
    });

    it('should update a user (USER role, matching email)', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated User' };
      const params: UserEmailDto = { email: 'test@example.com' };
      const currentUser: UserDto = { ...mockUser };

      const result = await controller.update(
        currentUser,
        updateUserDto,
        params,
      );

      expect(usersService.update).toHaveBeenCalledWith(
        currentUser.email,
        updateUserDto,
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException (USER role, mismatched email)', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated User' };
      const params: UserEmailDto = { email: 'different@example.com' };
      const currentUser: UserDto = { ...mockUser };

      await expect(
        controller.update(currentUser, updateUserDto, params),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a user (ADMIN role, different email)', async () => {
      const params: UserEmailDto = { email: 'different@example.com' };
      const currentUser: UserDto = { ...mockUser, role: 'ADMIN' };

      const result = await controller.remove(currentUser, params);

      expect(usersService.remove).toHaveBeenCalledWith(params.email);
      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException (user trying to delete themselves)', async () => {
      const params: UserEmailDto = { email: 'test@example.com' };
      const currentUser: UserDto = { ...mockUser };

      await expect(controller.remove(currentUser, params)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findOne', () => {
    it('should retrieve user details for the logged-in user', async () => {
      const currentUser: UserDto = { ...mockUser };
      const result = await controller.findOne(currentUser);

      expect(usersService.findOne).toHaveBeenCalledWith(currentUser.id);
      expect(result).toEqual(mockUser);
    });
  });
});
