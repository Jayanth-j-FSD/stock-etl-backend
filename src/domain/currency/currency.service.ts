import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CurrencyRepository } from './currency.repository';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { CurrencyResponseDto } from './dto/response-currency.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CurrencyService {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  async create(createCurrencyDto: CreateCurrencyDto): Promise<CurrencyResponseDto> {
    // Normalize currency code to uppercase
    const normalizedDto = {
      ...createCurrencyDto,
      code: createCurrencyDto.code.toUpperCase(),
      baseCurrency: createCurrencyDto.baseCurrency.toUpperCase(),
    };

    // Check if currency with code already exists
    const existingCurrency = await this.currencyRepository.findByCode(normalizedDto.code);
    if (existingCurrency) {
      throw new ConflictException(`Currency with code ${normalizedDto.code} already exists`);
    }

    const currency = await this.currencyRepository.create(normalizedDto);
    return plainToClass(CurrencyResponseDto, currency, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<CurrencyResponseDto[]> {
    const currencies = await this.currencyRepository.findAll();
    return currencies.map((currency) =>
      plainToClass(CurrencyResponseDto, currency, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findById(id: string): Promise<CurrencyResponseDto> {
    const currency = await this.currencyRepository.findById(id);
    if (!currency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }
    return plainToClass(CurrencyResponseDto, currency, {
      excludeExtraneousValues: true,
    });
  }

  async findByCode(code: string): Promise<CurrencyResponseDto> {
    const currency = await this.currencyRepository.findByCode(code.toUpperCase());
    if (!currency) {
      throw new NotFoundException(`Currency with code ${code} not found`);
    }
    return plainToClass(CurrencyResponseDto, currency, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateCurrencyDto: UpdateCurrencyDto): Promise<CurrencyResponseDto> {
    // Check if currency exists
    const existingCurrency = await this.currencyRepository.findById(id);
    if (!existingCurrency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }

    // Normalize codes if provided
    const normalizedDto = {
      ...updateCurrencyDto,
      ...(updateCurrencyDto.code && {
        code: updateCurrencyDto.code.toUpperCase(),
      }),
      ...(updateCurrencyDto.baseCurrency && {
        baseCurrency: updateCurrencyDto.baseCurrency.toUpperCase(),
      }),
    };

    // If code is being updated, check if new code already exists
    if (normalizedDto.code && normalizedDto.code !== existingCurrency.code) {
      const codeExists = await this.currencyRepository.findByCode(normalizedDto.code);
      if (codeExists) {
        throw new ConflictException(`Currency with code ${normalizedDto.code} already exists`);
      }
    }

    const updatedCurrency = await this.currencyRepository.update(id, normalizedDto);
    if (!updatedCurrency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }

    return plainToClass(CurrencyResponseDto, updatedCurrency, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string): Promise<void> {
    const currency = await this.currencyRepository.findById(id);
    if (!currency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }
    await this.currencyRepository.delete(id);
  }

  async search(query: string): Promise<CurrencyResponseDto[]> {
    const currencies = await this.currencyRepository.searchByCodeOrName(query);
    return currencies.map((currency) =>
      plainToClass(CurrencyResponseDto, currency, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findByBaseCurrency(baseCurrency: string): Promise<CurrencyResponseDto[]> {
    const currencies = await this.currencyRepository.findByBaseCurrency(baseCurrency.toUpperCase());
    return currencies.map((currency) =>
      plainToClass(CurrencyResponseDto, currency, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
