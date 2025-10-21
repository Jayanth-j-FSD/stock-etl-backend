import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StockRepository {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async create(createStockDto: CreateStockDto): Promise<Stock> {
    const stock = this.stockRepository.create({
      ...createStockDto,
      lastUpdated: new Date(),
    });
    return this.stockRepository.save(stock);
  }

  async findAll(): Promise<Stock[]> {
    return this.stockRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Stock | null> {
    return this.stockRepository.findOne({ where: { id } });
  }

  async findBySymbol(symbol: string): Promise<Stock | null> {
    return this.stockRepository.findOne({ where: { symbol } });
  }

  async update(id: string, updateStockDto: UpdateStockDto): Promise<Stock | null> {
    await this.stockRepository.update(id, {
      ...updateStockDto,
      lastUpdated: new Date(),
    });
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.stockRepository.delete(id);
  }

  async searchBySymbolOrName(query: string): Promise<Stock[]> {
    return this.stockRepository
      .createQueryBuilder('stock')
      .where('stock.symbol ILIKE :query OR stock.name ILIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('stock.symbol', 'ASC')
      .getMany();
  }

  async findByMarket(market: string): Promise<Stock[]> {
    return this.stockRepository.find({
      where: { market },
      order: { symbol: 'ASC' },
    });
  }

  async findBySector(sector: string): Promise<Stock[]> {
    return this.stockRepository.find({
      where: { sector },
      order: { symbol: 'ASC' },
    });
  }
}
