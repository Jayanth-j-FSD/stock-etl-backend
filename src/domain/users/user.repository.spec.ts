import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockRepository: jest.Mocked<Repository<User>>;

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
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user with all fields', async () => {
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await repository.createUser(
        'test@example.com',
        '$2b$10$hashedpassword',
        'John',
        'Doe'
      );

      expect(mockRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: '$2b$10$hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should create a user without optional fields', async () => {
      const userWithoutNames = { ...mockUser, firstName: null, lastName: null } as any;
      mockRepository.create.mockReturnValue(userWithoutNames);
      mockRepository.save.mockResolvedValue(userWithoutNames);

      const result = await repository.createUser(
        'test@example.com',
        '$2b$10$hashedpassword'
      );

      expect(mockRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: '$2b$10$hashedpassword',
        firstName: undefined,
        lastName: undefined,
      });
      expect(result).toEqual(userWithoutNames);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      mockRepository.find.mockResolvedValue(users);

      const result = await repository.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should return empty array when no users exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.findByEmail('test@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when email not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.findById(id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user and return updated entity', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = { firstName: 'Jane' };

      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValue({ ...mockUser, firstName: 'Jane' });

      const result = await repository.updateUser(id, updateData);

      expect(mockRepository.update).toHaveBeenCalledWith(id, updateData);
      expect(result).toHaveProperty('firstName', 'Jane');
    });

    it('should update multiple fields', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      };

      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValue({ ...mockUser, ...updateData });

      await repository.updateUser(id, updateData);

      expect(mockRepository.update).toHaveBeenCalledWith(id, updateData);
    });

    it('should return null when user not found after update', async () => {
      mockRepository.update.mockResolvedValue({ affected: 0 } as any);
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.updateUser('non-existent-id', {});

      expect(result).toBeNull();
    });
  });

  describe('softDeleteUser', () => {
    it('should soft delete user by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.softDelete.mockResolvedValue({ affected: 1 } as any);

      await repository.softDeleteUser(id);

      expect(mockRepository.softDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteUser', () => {
    it('should permanently delete user by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.deleteUser(id);

      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
