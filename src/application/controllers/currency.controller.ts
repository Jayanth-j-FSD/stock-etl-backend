import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CurrencyService } from '../../domain/currency/currency.service';
import { CreateCurrencyDto } from '../../domain/currency/dto/create-currency.dto';
import { UpdateCurrencyDto } from '../../domain/currency/dto/update-currency.dto';
import { CurrencyResponseDto } from '../../domain/currency/dto/response-currency.dto';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';

@Controller('currency')
@UseGuards(JwtAuthGuard)
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCurrencyDto: CreateCurrencyDto): Promise<CurrencyResponseDto> {
    return this.currencyService.create(createCurrencyDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('search') search?: string): Promise<CurrencyResponseDto[]> {
    if (search) {
      return this.currencyService.search(search);
    }
    return this.currencyService.findAll();
  }

  @Get('base/:baseCurrency')
  @HttpCode(HttpStatus.OK)
  async findByBaseCurrency(
    @Param('baseCurrency') baseCurrency: string,
  ): Promise<CurrencyResponseDto[]> {
    return this.currencyService.findByBaseCurrency(baseCurrency);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async findByCode(@Param('code') code: string): Promise<CurrencyResponseDto> {
    return this.currencyService.findByCode(code);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<CurrencyResponseDto> {
    return this.currencyService.findById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<CurrencyResponseDto> {
    return this.currencyService.update(id, updateCurrencyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.currencyService.delete(id);
  }
}
