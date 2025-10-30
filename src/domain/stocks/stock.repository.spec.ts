import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockRepository } from './stock.repository';
import { Stock } from './stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

describe('StockRepository', () => {
  let repository: StockRepository;
  let mockRepository: jest.Mocked<Repository<Stock>>;

  const mockStock: Stock = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    market: 'NASDAQ',
    price: 150.25,
    lastUpdated: new Date('2024-01-01'),
    sector: 'Technology',
    industry: 'Consumer Electronics',
    marketCap: 2500000000000,
    dayHigh: 152.0,
    dayLow: 149.5,
    openPrice: 150.0,
    previousClose: 149.75,
    volume: 50000000,
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
        StockRepository,
        {
          provide: getRepositoryToken(Stock),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<StockRepository>(StockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a stock', async () => {
      const createDto: CreateStockDto = {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        market: 'NASDAQ',
        price: 150.25,
      };

      mockRepository.create.mockReturnValue(mockStock);
      mockRepository.save.mockResolvedValue(mockStock);

      const result = await repository.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        lastUpdated: expect.any(Date),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockStock);
      expect(result).toEqual(mockStock);
    });

    it('should set lastUpdated to current date', async () => {
      const createDto: CreateStockDto = {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
      };

      mockRepository.create.mockReturnValue(mockStock);
      mockRepository.save.mockResolvedValue(mockStock);

      await repository.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        lastUpdated: expect.any(Date),
      });
    });
  });

  describe('findAll', () => {
    it('should return all stocks sorted by createdAt DESC', async () => {
      const stocks = [mockStock];
      mockRepository.find.mockResolvedValue(stocks);

      const result = await repository.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(stocks);
    });

    it('should return empty array when no stocks exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should find stock by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.findOne.mockResolvedValue(mockStock);

      const result = await repository.findById(id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockStock);
    });

    it('should return null when stock not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findBySymbol', () => {
    it('should find stock by symbol', async () => {
      mockRepository.findOne.mockResolvedValue(mockStock);

      const result = await repository.findBySymbol('AAPL');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { symbol: 'AAPL' } });
      expect(result).toEqual(mockStock);
    });

    it('should return null when symbol not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findBySymbol('XXX');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update stock and return updated entity', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateStockDto = {
        price: 155.5,
      };

      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValue({ ...mockStock, price: 155.5 });

      const result = await repository.update(id, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(id, {
        ...updateDto,
        lastUpdated: expect.any(Date),
      });
      expect(result).toHaveProperty('price', 155.5);
    });

    it('should update lastUpdated timestamp', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateStockDto = {
        price: 155.5,
      };

      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValue(mockStock);

      await repository.update(id, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(id, {
        ...updateDto,
        lastUpdated: expect.any(Date),
      });
    });

    it('should return null when stock not found after update', async () => {
      mockRepository.update.mockResolvedValue({ affected: 0 } as any);
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.update('non-existent-id', {});

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete stock by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete(id);

      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('searchBySymbolOrName', () => {
    it('should search stocks by symbol or name', async () => {
      const mockQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockStock]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await repository.searchBySymbolOrName('AAPL');

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('stock');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'stock.symbol ILIKE :query OR stock.name ILIKE :query',
        { query: '%AAPL%' },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('stock.symbol', 'ASC');
      expect(result).toEqual([mockStock]);
    });

    it('should search with partial match', async () => {
      const mockQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockStock]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await repository.searchBySymbolOrName('App');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(expect.any(String), { query: '%App%' });
    });

    it('should return empty array when no matches found', async () => {
      const mockQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await repository.searchBySymbolOrName('NONEXISTENT');

      expect(result).toEqual([]);
    });
  });

  describe('findByMarket', () => {
    it('should find stocks by market', async () => {
      const stocks = [mockStock];
      mockRepository.find.mockResolvedValue(stocks);

      const result = await repository.findByMarket('NASDAQ');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { market: 'NASDAQ' },
        order: { symbol: 'ASC' },
      });
      expect(result).toEqual(stocks);
    });

    it('should return empty array when no stocks match market', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await repository.findByMarket('UNKNOWN');

      expect(result).toEqual([]);
    });
  });

  describe('findBySector', () => {
    it('should find stocks by sector', async () => {
      const stocks = [mockStock];
      mockRepository.find.mockResolvedValue(stocks);

      const result = await repository.findBySector('Technology');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { sector: 'Technology' },
        order: { symbol: 'ASC' },
      });
      expect(result).toEqual(stocks);
    });

    it('should return empty array when no stocks match sector', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await repository.findBySector('UNKNOWN');

      expect(result).toEqual([]);
    });
  });
});
