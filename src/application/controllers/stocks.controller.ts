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
import { StockService } from '../../domain/stocks/stock.service';
import { CreateStockDto } from '../../domain/stocks/dto/create-stock.dto';
import { UpdateStockDto } from '../../domain/stocks/dto/update-stock.dto';
import { StockResponseDto } from '../../domain/stocks/dto/stock-response.dto';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';

@Controller('stocks')
@UseGuards(JwtAuthGuard)
export class StocksController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createStockDto: CreateStockDto): Promise<StockResponseDto> {
    return this.stockService.create(createStockDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('search') search?: string): Promise<StockResponseDto[]> {
    if (search) {
      return this.stockService.search(search);
    }
    return this.stockService.findAll();
  }

  @Get('market/:market')
  @HttpCode(HttpStatus.OK)
  async findByMarket(@Param('market') market: string): Promise<StockResponseDto[]> {
    return this.stockService.findByMarket(market);
  }

  @Get('sector/:sector')
  @HttpCode(HttpStatus.OK)
  async findBySector(@Param('sector') sector: string): Promise<StockResponseDto[]> {
    return this.stockService.findBySector(sector);
  }

  @Get('symbol/:symbol')
  @HttpCode(HttpStatus.OK)
  async findBySymbol(@Param('symbol') symbol: string): Promise<StockResponseDto> {
    return this.stockService.findBySymbol(symbol);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<StockResponseDto> {
    return this.stockService.findById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<StockResponseDto> {
    return this.stockService.update(id, updateStockDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.stockService.delete(id);
  }
}
