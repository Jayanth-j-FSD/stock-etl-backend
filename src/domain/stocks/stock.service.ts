import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { StockRepository } from './stock.repository';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { StockResponseDto } from './dto/stock-response.dto';
import { plainToClass } from 'class-transformer';
import { DatabaseService } from '../../infrastructure/database/database.service';

@Injectable()
export class StockService {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(createStockDto: CreateStockDto): Promise<StockResponseDto> {
    // Normalize symbol to uppercase
    const normalizedDto = {
      ...createStockDto,
      symbol: createStockDto.symbol.toUpperCase(),
    };

    // Check if stock with symbol already exists
    const existingStock = await this.stockRepository.findBySymbol(normalizedDto.symbol);
    if (existingStock) {
      throw new ConflictException(
        `Stock with symbol ${normalizedDto.symbol} already exists`,
      );
    }

    const stock = await this.stockRepository.create(normalizedDto);
    return plainToClass(StockResponseDto, stock, { excludeExtraneousValues: true });
  }

  async findAll(): Promise<StockResponseDto[]> {
    const stocks = await this.stockRepository.findAll();
    return stocks.map((stock) =>
      plainToClass(StockResponseDto, stock, { excludeExtraneousValues: true }),
    );
  }

  async findById(id: string): Promise<StockResponseDto> {
    const stock = await this.stockRepository.findById(id);
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }
    return plainToClass(StockResponseDto, stock, { excludeExtraneousValues: true });
  }

  async findBySymbol(symbol: string): Promise<StockResponseDto> {
    const stock = await this.stockRepository.findBySymbol(symbol.toUpperCase());
    if (!stock) {
      throw new NotFoundException(`Stock with symbol ${symbol} not found`);
    }
    return plainToClass(StockResponseDto, stock, { excludeExtraneousValues: true });
  }

  async update(id: string, updateStockDto: UpdateStockDto): Promise<StockResponseDto> {
    // Check if stock exists
    const existingStock = await this.stockRepository.findById(id);
    if (!existingStock) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }

    // Normalize symbol if provided
    const normalizedDto = updateStockDto.symbol
      ? { ...updateStockDto, symbol: updateStockDto.symbol.toUpperCase() }
      : updateStockDto;

    // If symbol is being updated, check if new symbol already exists
    if (
      normalizedDto.symbol &&
      normalizedDto.symbol !== existingStock.symbol
    ) {
      const symbolExists = await this.stockRepository.findBySymbol(normalizedDto.symbol);
      if (symbolExists) {
        throw new ConflictException(
          `Stock with symbol ${normalizedDto.symbol} already exists`,
        );
      }
    }

    const updatedStock = await this.stockRepository.update(id, normalizedDto);
    if (!updatedStock) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }

    return plainToClass(StockResponseDto, updatedStock, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string): Promise<void> {
    const stock = await this.stockRepository.findById(id);
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }
    await this.stockRepository.delete(id);
  }

  async search(query: string): Promise<StockResponseDto[]> {
    const stocks = await this.stockRepository.searchBySymbolOrName(query);
    return stocks.map((stock) =>
      plainToClass(StockResponseDto, stock, { excludeExtraneousValues: true }),
    );
  }

  async findByMarket(market: string): Promise<StockResponseDto[]> {
    const stocks = await this.stockRepository.findByMarket(market);
    return stocks.map((stock) =>
      plainToClass(StockResponseDto, stock, { excludeExtraneousValues: true }),
    );
  }

  async findBySector(sector: string): Promise<StockResponseDto[]> {
    const stocks = await this.stockRepository.findBySector(sector);
    return stocks.map((stock) =>
      plainToClass(StockResponseDto, stock, { excludeExtraneousValues: true }),
    );
  }

  async checkDatabaseConnection(): Promise<boolean> {
    return this.databaseService.checkConnection();
  }
}
