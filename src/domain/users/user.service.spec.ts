import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    password: '$2b$10$hashedpassword',
    firstName: 'John',
    lastName: 'Doe',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null as any,
    refreshTokens: [],
  };

  beforeEach(async () => {
    const mockRepository: any = {
      createUser: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      updateUser: jest.fn(),
      softDeleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);

    (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('$2b$10$hashedpassword');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const createDto: CreateUserDto = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      repository.findByEmail.mockResolvedValue(null);
      repository.createUser.mockResolvedValue(mockUser);

      const result = await service.createUser(createDto);

      expect(repository.findByEmail).toHaveBeenCalledWith('newuser@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(repository.createUser).toHaveBeenCalledWith(
        'newuser@example.com',
        '$2b$10$hashedpassword',
        'John',
        'Doe',
      );
      expect(result).toBeDefined();
    });

    it('should throw ConflictException if email already exists', async () => {
      const createDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
      };

      repository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.createUser(createDto)).rejects.toThrow(ConflictException);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(repository.createUser).not.toHaveBeenCalled();
    });

    it('should create user without optional fields', async () => {
      const createDto: CreateUserDto = {
        email: 'minimal@example.com',
        password: 'password123',
      };

      repository.findByEmail.mockResolvedValue(null);
      repository.createUser.mockResolvedValue(mockUser);

      await service.createUser(createDto);

      expect(repository.createUser).toHaveBeenCalledWith(
        'minimal@example.com',
        '$2b$10$hashedpassword',
        undefined,
        undefined,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      repository.findAll.mockResolvedValue(users);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no users exist', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      repository.findById.mockResolvedValue(mockUser);

      const result = await service.findById('123e4567-e89b-12d3-a456-426614174000');

      expect(repository.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update user without password', async () => {
      const updateDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      repository.findById.mockResolvedValue(mockUser);
      repository.updateUser.mockResolvedValue({ ...mockUser, ...updateDto });

      const result = await service.updateUser('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(repository.updateUser).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        updateDto,
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should hash new password when updating', async () => {
      const updateDto: UpdateUserDto = {
        password: 'newpassword123',
      };

      repository.findById.mockResolvedValue(mockUser);
      repository.updateUser.mockResolvedValue(mockUser);

      await service.updateUser('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(repository.updateUser).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        expect.objectContaining({
          password: '$2b$10$hashedpassword',
        }),
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.updateUser('non-existent-id', { firstName: 'Jane' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if new email already exists', async () => {
      const existingEmailUser = { ...mockUser, id: 'different-id' };
      const updateDto: UpdateUserDto = {
        email: 'taken@example.com',
      };

      repository.findById.mockResolvedValue(mockUser);
      repository.findByEmail.mockResolvedValue(existingEmailUser);

      await expect(
        service.updateUser('123e4567-e89b-12d3-a456-426614174000', updateDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should allow updating user with same email', async () => {
      const updateDto: UpdateUserDto = {
        email: 'test@example.com',
        firstName: 'Jane',
      };

      repository.findById.mockResolvedValue(mockUser);
      repository.updateUser.mockResolvedValue({ ...mockUser, firstName: 'Jane' });

      await service.updateUser('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(repository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if update returns null', async () => {
      repository.findById.mockResolvedValue(mockUser);
      repository.updateUser.mockResolvedValue(null);

      await expect(
        service.updateUser('123e4567-e89b-12d3-a456-426614174000', { firstName: 'Jane' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update both password and other fields', async () => {
      const updateDto: UpdateUserDto = {
        password: 'newpassword123',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      repository.findById.mockResolvedValue(mockUser);
      repository.updateUser.mockResolvedValue(mockUser);

      await service.updateUser('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(repository.updateUser).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        expect.objectContaining({
          password: '$2b$10$hashedpassword',
          firstName: 'Jane',
          lastName: 'Smith',
        }),
      );
    });
  });

  describe('deleteUser', () => {
    it('should soft delete user', async () => {
      repository.findById.mockResolvedValue(mockUser);
      repository.softDeleteUser.mockResolvedValue(undefined);

      await service.deleteUser('123e4567-e89b-12d3-a456-426614174000');

      expect(repository.softDeleteUser).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.deleteUser('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(repository.softDeleteUser).not.toHaveBeenCalled();
    });
  });
});
