import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyRepository } from './currency.repository';
import { Currency } from './currency.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let repository: jest.Mocked<CurrencyRepository>;

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
    const mockRepository: any = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCode: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      searchByCodeOrName: jest.fn(),
      findByBaseCurrency: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: CurrencyRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
    repository = module.get(CurrencyRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new currency', async () => {
      const createDto: CreateCurrencyDto = {
        code: 'eur',
        name: 'Euro',
        exchangeRate: 1.08,
        baseCurrency: 'usd',
      };

      repository.findByCode.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockCurrency);

      const result = await service.create(createDto);

      expect(repository.findByCode).toHaveBeenCalledWith('EUR');
      expect(repository.create).toHaveBeenCalledWith({
        code: 'EUR',
        name: 'Euro',
        exchangeRate: 1.08,
        baseCurrency: 'USD',
      });
      expect(result).toBeDefined();
    });

    it('should normalize currency codes to uppercase', async () => {
      const createDto: CreateCurrencyDto = {
        code: 'gbp',
        name: 'British Pound',
        exchangeRate: 1.27,
        baseCurrency: 'usd',
      };

      repository.findByCode.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockCurrency);

      await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'GBP',
          baseCurrency: 'USD',
        })
      );
    });

    it('should throw ConflictException if currency code already exists', async () => {
      const createDto: CreateCurrencyDto = {
        code: 'USD',
        name: 'US Dollar',
        exchangeRate: 1.0,
        baseCurrency: 'USD',
      };

      repository.findByCode.mockResolvedValue(mockCurrency);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all currencies', async () => {
      const currencies = [mockCurrency];
      repository.findAll.mockResolvedValue(currencies);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no currencies exist', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return currency by id', async () => {
      repository.findById.mockResolvedValue(mockCurrency);

      const result = await service.findById('123e4567-e89b-12d3-a456-426614174000');

      expect(repository.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when currency not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCode', () => {
    it('should return currency by code', async () => {
      repository.findByCode.mockResolvedValue(mockCurrency);

      const result = await service.findByCode('usd');

      expect(repository.findByCode).toHaveBeenCalledWith('USD');
      expect(result).toBeDefined();
    });

    it('should normalize code to uppercase before searching', async () => {
      repository.findByCode.mockResolvedValue(mockCurrency);

      await service.findByCode('eur');

      expect(repository.findByCode).toHaveBeenCalledWith('EUR');
    });

    it('should throw NotFoundException when currency code not found', async () => {
      repository.findByCode.mockResolvedValue(null);

      await expect(service.findByCode('XXX')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update currency', async () => {
      const updateDto: UpdateCurrencyDto = {
        exchangeRate: 1.05,
      };

      repository.findById.mockResolvedValue(mockCurrency);
      repository.update.mockResolvedValue({ ...mockCurrency, exchangeRate: 1.05 });

      const result = await service.update('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(repository.update).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        updateDto
      );
      expect(result).toBeDefined();
    });

    it('should normalize codes when updating', async () => {
      const updateDto: UpdateCurrencyDto = {
        code: 'eur',
        baseCurrency: 'usd',
      };

      repository.findById.mockResolvedValue(mockCurrency);
      repository.findByCode.mockResolvedValue(null);
      repository.update.mockResolvedValue(mockCurrency);

      await service.update('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(repository.update).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        expect.objectContaining({
          code: 'EUR',
          baseCurrency: 'USD',
        })
      );
    });

    it('should throw NotFoundException if currency does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { exchangeRate: 1.05 })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new code already exists', async () => {
      const existingCurrency = { ...mockCurrency, id: 'different-id' };
      const updateDto: UpdateCurrencyDto = {
        code: 'EUR',
      };

      repository.findById.mockResolvedValue(mockCurrency);
      repository.findByCode.mockResolvedValue(existingCurrency);

      await expect(
        service.update('123e4567-e89b-12d3-a456-426614174000', updateDto)
      ).rejects.toThrow(ConflictException);
    });

    it('should allow updating currency with same code', async () => {
      const updateDto: UpdateCurrencyDto = {
        code: 'USD',
        exchangeRate: 1.05,
      };

      repository.findById.mockResolvedValue(mockCurrency);
      repository.update.mockResolvedValue({ ...mockCurrency, exchangeRate: 1.05 });

      await service.update('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(repository.findByCode).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if update returns null', async () => {
      repository.findById.mockResolvedValue(mockCurrency);
      repository.update.mockResolvedValue(null);

      await expect(
        service.update('123e4567-e89b-12d3-a456-426614174000', { exchangeRate: 1.05 })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete currency', async () => {
      repository.findById.mockResolvedValue(mockCurrency);
      repository.delete.mockResolvedValue(undefined);

      await service.delete('123e4567-e89b-12d3-a456-426614174000');

      expect(repository.delete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw NotFoundException if currency does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should search currencies by query', async () => {
      const currencies = [mockCurrency];
      repository.searchByCodeOrName.mockResolvedValue(currencies);

      const result = await service.search('USD');

      expect(repository.searchByCodeOrName).toHaveBeenCalledWith('USD');
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no matches found', async () => {
      repository.searchByCodeOrName.mockResolvedValue([]);

      const result = await service.search('NONEXISTENT');

      expect(result).toEqual([]);
    });
  });

  describe('findByBaseCurrency', () => {
    it('should find currencies by base currency', async () => {
      const currencies = [mockCurrency];
      repository.findByBaseCurrency.mockResolvedValue(currencies);

      const result = await service.findByBaseCurrency('usd');

      expect(repository.findByBaseCurrency).toHaveBeenCalledWith('USD');
      expect(result).toHaveLength(1);
    });

    it('should normalize base currency to uppercase', async () => {
      repository.findByBaseCurrency.mockResolvedValue([]);

      await service.findByBaseCurrency('eur');

      expect(repository.findByBaseCurrency).toHaveBeenCalledWith('EUR');
    });

    it('should return empty array when no currencies match', async () => {
      repository.findByBaseCurrency.mockResolvedValue([]);

      const result = await service.findByBaseCurrency('XXX');

      expect(result).toEqual([]);
    });
  });
});
