import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyRepository } from './currency.repository';
import { Currency } from './currency.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

describe('CurrencyRepository', () => {
  let repository: CurrencyRepository;
  let mockRepository: jest.Mocked<Repository<Currency>>;

  const mockCurrency: Currency = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    code: 'USD',
    name: 'US Dollar',
    exchangeRate: 1.0,
    baseCurrency: 'USD',
    lastUpdated: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyRepository,
        {
          provide: getRepositoryToken(Currency),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<CurrencyRepository>(CurrencyRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a currency', async () => {
      const createDto: CreateCurrencyDto = {
        code: 'USD',
        name: 'US Dollar',
        exchangeRate: 1.0,
        baseCurrency: 'USD',
      };

      mockRepository.create.mockReturnValue(mockCurrency);
      mockRepository.save.mockResolvedValue(mockCurrency);

      const result = await repository.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        lastUpdated: expect.any(Date),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockCurrency);
      expect(result).toEqual(mockCurrency);
    });

    it('should use provided lastUpdated date', async () => {
      const lastUpdated = new Date('2024-06-15');
      const createDto: CreateCurrencyDto = {
        code: 'EUR',
        name: 'Euro',
        exchangeRate: 1.08,
        baseCurrency: 'USD',
        lastUpdated,
      };

      mockRepository.create.mockReturnValue(mockCurrency);
      mockRepository.save.mockResolvedValue(mockCurrency);

      await repository.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        lastUpdated,
      });
    });
  });

  describe('findAll', () => {
    it('should return all currencies sorted by code', async () => {
      const currencies = [mockCurrency];
      mockRepository.find.mockResolvedValue(currencies);

      const result = await repository.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { code: 'ASC' },
      });
      expect(result).toEqual(currencies);
    });

    it('should return empty array when no currencies exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should find currency by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.findOne.mockResolvedValue(mockCurrency);

      const result = await repository.findById(id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockCurrency);
    });

    it('should return null when currency not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findByCode', () => {
    it('should find currency by code', async () => {
      mockRepository.findOne.mockResolvedValue(mockCurrency);

      const result = await repository.findByCode('USD');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { code: 'USD' } });
      expect(result).toEqual(mockCurrency);
    });

    it('should return null when currency code not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByCode('XXX');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update currency and return updated entity', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCurrencyDto = {
        exchangeRate: 1.05,
      };

      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValue({ ...mockCurrency, exchangeRate: 1.05 });

      const result = await repository.update(id, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(id, {
        ...updateDto,
        lastUpdated: expect.any(Date),
      });
      expect(result).toHaveProperty('exchangeRate', 1.05);
    });

    it('should use provided lastUpdated date in update', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const lastUpdated = new Date('2024-06-15');
      const updateDto: UpdateCurrencyDto = {
        exchangeRate: 1.05,
        lastUpdated,
      };

      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValue(mockCurrency);

      await repository.update(id, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(id, {
        ...updateDto,
        lastUpdated,
      });
    });

    it('should return null when currency not found after update', async () => {
      mockRepository.update.mockResolvedValue({ affected: 0 } as any);
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.update('non-existent-id', {});

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete currency by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete(id);

      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('findByBaseCurrency', () => {
    it('should find currencies by base currency', async () => {
      const currencies = [mockCurrency];
      mockRepository.find.mockResolvedValue(currencies);

      const result = await repository.findByBaseCurrency('USD');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { baseCurrency: 'USD' },
        order: { code: 'ASC' },
      });
      expect(result).toEqual(currencies);
    });

    it('should return empty array when no currencies match base currency', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await repository.findByBaseCurrency('XXX');

      expect(result).toEqual([]);
    });
  });

  describe('searchByCodeOrName', () => {
    it('should search currencies by code or name', async () => {
      const mockQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockCurrency]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await repository.searchByCodeOrName('USD');

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('currency');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'currency.code ILIKE :query OR currency.name ILIKE :query',
        { query: '%USD%' }
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('currency.code', 'ASC');
      expect(result).toEqual([mockCurrency]);
    });

    it('should search with partial match', async () => {
      const mockQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockCurrency]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await repository.searchByCodeOrName('US');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        expect.any(String),
        { query: '%US%' }
      );
    });

    it('should return empty array when no matches found', async () => {
      const mockQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await repository.searchByCodeOrName('NONEXISTENT');

      expect(result).toEqual([]);
    });
  });
});
