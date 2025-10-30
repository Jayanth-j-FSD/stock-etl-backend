import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockRepository } from './stock.repository';
import { DatabaseService } from '../../infrastructure/database/database.service';
import { Stock } from './stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

describe('StockService', () => {
  let service: StockService;
  let repository: jest.Mocked<StockRepository>;
  let databaseService: jest.Mocked<DatabaseService>;

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
    dayHigh: 152.00,
    dayLow: 149.50,
    openPrice: 150.00,
    previousClose: 149.75,
    volume: 50000000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const mockRepository: any = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySymbol: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      searchBySymbolOrName: jest.fn(),
      findByMarket: jest.fn(),
      findBySector: jest.fn(),
    };

    const mockDatabaseService: any = {
      checkConnection: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: StockRepository,
          useValue: mockRepository,
        },
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
    repository = module.get(StockRepository);
    databaseService = module.get(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new stock', async () => {
      const createDto: CreateStockDto = {
        symbol: 'aapl',
        name: 'Apple Inc.',
        market: 'NASDAQ',
        price: 150.25,
      };

      repository.findBySymbol.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockStock);

      const result = await service.create(createDto);

      expect(repository.findBySymbol).toHaveBeenCalledWith('AAPL');
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        symbol: 'AAPL',
      });
      expect(result).toBeDefined();
    });

    it('should normalize symbol to uppercase', async () => {
      const createDto: CreateStockDto = {
        symbol: 'googl',
        name: 'Alphabet Inc.',
      };

      repository.findBySymbol.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockStock);

      await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          symbol: 'GOOGL',
        })
      );
    });

    it('should throw ConflictException if symbol already exists', async () => {
      const createDto: CreateStockDto = {
        symbol: 'AAPL',
        name: 'Apple Inc.',
      };

      repository.findBySymbol.mockResolvedValue(mockStock);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all stocks', async () => {
      const stocks = [mockStock];
      repository.findAll.mockResolvedValue(stocks);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no stocks exist', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return stock by id', async () => {
      repository.findById.mockResolvedValue(mockStock);

      const result = await service.findById('123e4567-e89b-12d3-a456-426614174000');

      expect(repository.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when stock not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySymbol', () => {
    it('should return stock by symbol', async () => {
      repository.findBySymbol.mockResolvedValue(mockStock);

      const result = await service.findBySymbol('aapl');

      expect(repository.findBySymbol).toHaveBeenCalledWith('AAPL');
      expect(result).toBeDefined();
    });

    it('should normalize symbol to uppercase before searching', async () => {
      repository.findBySymbol.mockResolvedValue(mockStock);

      await service.findBySymbol('googl');

      expect(repository.findBySymbol).toHaveBeenCalledWith('GOOGL');
    });

    it('should throw NotFoundException when symbol not found', async () => {
      repository.findBySymbol.mockResolvedValue(null);

      await expect(service.findBySymbol('XXX')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update stock', async () => {
      const updateDto: UpdateStockDto = {
        price: 155.50,
      };

      repository.findById.mockResolvedValue(mockStock);
      repository.update.mockResolvedValue({ ...mockStock, price: 155.50 });

      const result = await service.update('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(repository.update).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        updateDto
      );
      expect(result).toBeDefined();
    });

    it('should normalize symbol when updating', async () => {
      const updateDto: UpdateStockDto = {
        symbol: 'googl',
      };

      repository.findById.mockResolvedValue(mockStock);
      repository.findBySymbol.mockResolvedValue(null);
      repository.update.mockResolvedValue(mockStock);

      await service.update('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(repository.update).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        expect.objectContaining({
          symbol: 'GOOGL',
        })
      );
    });

    it('should throw NotFoundException if stock does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { price: 155.50 })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new symbol already exists', async () => {
      const existingStock = { ...mockStock, id: 'different-id' };
      const updateDto: UpdateStockDto = {
        symbol: 'GOOGL',
      };

      repository.findById.mockResolvedValue(mockStock);
      repository.findBySymbol.mockResolvedValue(existingStock);

      await expect(
        service.update('123e4567-e89b-12d3-a456-426614174000', updateDto)
      ).rejects.toThrow(ConflictException);
    });

    it('should allow updating stock with same symbol', async () => {
      const updateDto: UpdateStockDto = {
        symbol: 'AAPL',
        price: 155.50,
      };

      repository.findById.mockResolvedValue(mockStock);
      repository.update.mockResolvedValue({ ...mockStock, price: 155.50 });

      await service.update('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(repository.findBySymbol).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if update returns null', async () => {
      repository.findById.mockResolvedValue(mockStock);
      repository.update.mockResolvedValue(null);

      await expect(
        service.update('123e4567-e89b-12d3-a456-426614174000', { price: 155.50 })
      ).rejects.toThrow(NotFoundException);
    });

    it('should not normalize symbol if not provided', async () => {
      const updateDto: UpdateStockDto = {
        price: 155.50,
      };

      repository.findById.mockResolvedValue(mockStock);
      repository.update.mockResolvedValue({ ...mockStock, price: 155.50 });

      await service.update('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(repository.update).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        updateDto
      );
    });
  });

  describe('delete', () => {
    it('should delete stock', async () => {
      repository.findById.mockResolvedValue(mockStock);
      repository.delete.mockResolvedValue(undefined);

      await service.delete('123e4567-e89b-12d3-a456-426614174000');

      expect(repository.delete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw NotFoundException if stock does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should search stocks by query', async () => {
      const stocks = [mockStock];
      repository.searchBySymbolOrName.mockResolvedValue(stocks);

      const result = await service.search('AAPL');

      expect(repository.searchBySymbolOrName).toHaveBeenCalledWith('AAPL');
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no matches found', async () => {
      repository.searchBySymbolOrName.mockResolvedValue([]);

      const result = await service.search('NONEXISTENT');

      expect(result).toEqual([]);
    });
  });

  describe('findByMarket', () => {
    it('should find stocks by market', async () => {
      const stocks = [mockStock];
      repository.findByMarket.mockResolvedValue(stocks);

      const result = await service.findByMarket('NASDAQ');

      expect(repository.findByMarket).toHaveBeenCalledWith('NASDAQ');
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no stocks match market', async () => {
      repository.findByMarket.mockResolvedValue([]);

      const result = await service.findByMarket('UNKNOWN');

      expect(result).toEqual([]);
    });
  });

  describe('findBySector', () => {
    it('should find stocks by sector', async () => {
      const stocks = [mockStock];
      repository.findBySector.mockResolvedValue(stocks);

      const result = await service.findBySector('Technology');

      expect(repository.findBySector).toHaveBeenCalledWith('Technology');
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no stocks match sector', async () => {
      repository.findBySector.mockResolvedValue([]);

      const result = await service.findBySector('UNKNOWN');

      expect(result).toEqual([]);
    });
  });

  describe('checkDatabaseConnection', () => {
    it('should return true when database is connected', async () => {
      databaseService.checkConnection.mockResolvedValue(true);

      const result = await service.checkDatabaseConnection();

      expect(databaseService.checkConnection).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when database is not connected', async () => {
      databaseService.checkConnection.mockResolvedValue(false);

      const result = await service.checkDatabaseConnection();

      expect(result).toBe(false);
    });
  });
});
