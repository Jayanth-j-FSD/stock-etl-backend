import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './currency.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class CurrencyRepository {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    const currency = this.currencyRepository.create({
      ...createCurrencyDto,
      lastUpdated: createCurrencyDto.lastUpdated || new Date(),
    });
    return this.currencyRepository.save(currency);
  }

  async findAll(): Promise<Currency[]> {
    return this.currencyRepository.find({
      order: { code: 'ASC' },
    });
  }

  async findById(id: string): Promise<Currency | null> {
    return this.currencyRepository.findOne({ where: { id } });
  }

  async findByCode(code: string): Promise<Currency | null> {
    return this.currencyRepository.findOne({ where: { code } });
  }

  async update(id: string, updateCurrencyDto: UpdateCurrencyDto): Promise<Currency | null> {
    await this.currencyRepository.update(id, {
      ...updateCurrencyDto,
      lastUpdated: updateCurrencyDto.lastUpdated || new Date(),
    });
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.currencyRepository.delete(id);
  }

  async findByBaseCurrency(baseCurrency: string): Promise<Currency[]> {
    return this.currencyRepository.find({
      where: { baseCurrency },
      order: { code: 'ASC' },
    });
  }

  async searchByCodeOrName(query: string): Promise<Currency[]> {
    return this.currencyRepository
      .createQueryBuilder('currency')
      .where('currency.code ILIKE :query OR currency.name ILIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('currency.code', 'ASC')
      .getMany();
  }
}
