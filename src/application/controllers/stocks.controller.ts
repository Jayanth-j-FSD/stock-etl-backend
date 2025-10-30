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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StockService } from '../../domain/stocks/stock.service';
import { CreateStockDto } from '../../domain/stocks/dto/create-stock.dto';
import { UpdateStockDto } from '../../domain/stocks/dto/update-stock.dto';
import { StockResponseDto } from '../../domain/stocks/dto/stock-response.dto';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';

@ApiTags('Stocks')
@ApiBearerAuth('JWT-auth')
@Controller('stocks')
@UseGuards(JwtAuthGuard)
export class StocksController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new stock',
    description:
      'Add a new stock to the system. Stock symbol must be unique and will be normalized to uppercase. Requires JWT authentication.',
  })
  @ApiBody({ type: CreateStockDto })
  @ApiResponse({
    status: 201,
    description: 'Stock successfully created.',
    type: StockResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data or validation failed.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Stock with this symbol already exists.',
  })
  async create(@Body() createStockDto: CreateStockDto): Promise<StockResponseDto> {
    return this.stockService.create(createStockDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all stocks or search',
    description:
      'Retrieve all stocks or search by symbol/name using case-insensitive query. Requires JWT authentication.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description: 'Search term for stock symbol or name (case-insensitive)',
    example: 'AAPL',
  })
  @ApiResponse({
    status: 200,
    description: 'List of stocks successfully retrieved.',
    type: [StockResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
  })
  async findAll(@Query('search') search?: string): Promise<StockResponseDto[]> {
    if (search) {
      return this.stockService.search(search);
    }
    return this.stockService.findAll();
  }

  @Get('market/:market')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get stocks by market',
    description:
      'Retrieve all stocks from a specific market (e.g., NASDAQ, NYSE). Requires JWT authentication.',
  })
  @ApiParam({
    name: 'market',
    type: 'string',
    description: 'Market name (e.g., NASDAQ, NYSE)',
    example: 'NASDAQ',
  })
  @ApiResponse({
    status: 200,
    description: 'List of stocks from the specified market.',
    type: [StockResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
  })
  async findByMarket(@Param('market') market: string): Promise<StockResponseDto[]> {
    return this.stockService.findByMarket(market);
  }

  @Get('sector/:sector')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get stocks by sector',
    description:
      'Retrieve all stocks from a specific sector (e.g., Technology, Healthcare). Requires JWT authentication.',
  })
  @ApiParam({
    name: 'sector',
    type: 'string',
    description: 'Sector name (e.g., Technology, Healthcare, Finance)',
    example: 'Technology',
  })
  @ApiResponse({
    status: 200,
    description: 'List of stocks from the specified sector.',
    type: [StockResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
  })
  async findBySector(@Param('sector') sector: string): Promise<StockResponseDto[]> {
    return this.stockService.findBySector(sector);
  }

  @Get('symbol/:symbol')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get stock by symbol',
    description:
      'Retrieve a specific stock by its symbol (e.g., AAPL, MSFT). Symbol will be normalized to uppercase. Requires JWT authentication.',
  })
  @ApiParam({
    name: 'symbol',
    type: 'string',
    description: 'Stock symbol (case-insensitive)',
    example: 'AAPL',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock successfully retrieved.',
    type: StockResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Stock with specified symbol does not exist.',
  })
  async findBySymbol(@Param('symbol') symbol: string): Promise<StockResponseDto> {
    return this.stockService.findBySymbol(symbol);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get stock by ID',
    description: 'Retrieve a specific stock by its UUID. Requires JWT authentication.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Stock UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock successfully retrieved.',
    type: StockResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Stock with specified ID does not exist.',
  })
  async findById(@Param('id') id: string): Promise<StockResponseDto> {
    return this.stockService.findById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update stock',
    description:
      'Update stock information by UUID. Only provided fields will be updated. Requires JWT authentication.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Stock UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateStockDto })
  @ApiResponse({
    status: 200,
    description: 'Stock successfully updated.',
    type: StockResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Stock with specified ID does not exist.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<StockResponseDto> {
    return this.stockService.update(id, updateStockDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete stock',
    description:
      'Delete a stock by UUID. Permanently removes the stock from the system. Requires JWT authentication.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Stock UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Stock successfully deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Stock with specified ID does not exist.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.stockService.delete(id);
  }
}
