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
import { CurrencyService } from '../../domain/currency/currency.service';
import { CreateCurrencyDto } from '../../domain/currency/dto/create-currency.dto';
import { UpdateCurrencyDto } from '../../domain/currency/dto/update-currency.dto';
import { CurrencyResponseDto } from '../../domain/currency/dto/response-currency.dto';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';

@ApiTags('Currency')
@ApiBearerAuth('JWT-auth')
@Controller('currency')
@UseGuards(JwtAuthGuard)
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new currency',
    description:
      'Add a new currency to the system. Currency code must be unique (3 characters) and will be normalized to uppercase. Requires JWT authentication.',
  })
  @ApiBody({ type: CreateCurrencyDto })
  @ApiResponse({
    status: 201,
    description: 'Currency successfully created.',
    type: CurrencyResponseDto,
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
    description: 'Conflict - Currency with this code already exists.',
  })
  async create(@Body() createCurrencyDto: CreateCurrencyDto): Promise<CurrencyResponseDto> {
    return this.currencyService.create(createCurrencyDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all currencies or search',
    description:
      'Retrieve all currencies or search by code/name using case-insensitive query. Requires JWT authentication.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description: 'Search term for currency code or name (case-insensitive)',
    example: 'USD',
  })
  @ApiResponse({
    status: 200,
    description: 'List of currencies successfully retrieved.',
    type: [CurrencyResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
  })
  async findAll(@Query('search') search?: string): Promise<CurrencyResponseDto[]> {
    if (search) {
      return this.currencyService.search(search);
    }
    return this.currencyService.findAll();
  }

  @Get('base/:baseCurrency')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get currencies by base currency',
    description:
      'Retrieve all currencies with a specific base currency (e.g., USD, EUR). Requires JWT authentication.',
  })
  @ApiParam({
    name: 'baseCurrency',
    type: 'string',
    description: 'Base currency code (3 characters, e.g., USD, EUR, GBP)',
    example: 'USD',
  })
  @ApiResponse({
    status: 200,
    description: 'List of currencies with the specified base currency.',
    type: [CurrencyResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
  })
  async findByBaseCurrency(
    @Param('baseCurrency') baseCurrency: string,
  ): Promise<CurrencyResponseDto[]> {
    return this.currencyService.findByBaseCurrency(baseCurrency);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get currency by code',
    description:
      'Retrieve a specific currency by its code (e.g., USD, EUR, GBP). Code will be normalized to uppercase. Requires JWT authentication.',
  })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Currency code (3 characters, case-insensitive)',
    example: 'USD',
  })
  @ApiResponse({
    status: 200,
    description: 'Currency successfully retrieved.',
    type: CurrencyResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Currency with specified code does not exist.',
  })
  async findByCode(@Param('code') code: string): Promise<CurrencyResponseDto> {
    return this.currencyService.findByCode(code);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get currency by ID',
    description: 'Retrieve a specific currency by its UUID. Requires JWT authentication.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Currency UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Currency successfully retrieved.',
    type: CurrencyResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Currency with specified ID does not exist.',
  })
  async findById(@Param('id') id: string): Promise<CurrencyResponseDto> {
    return this.currencyService.findById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update currency',
    description:
      'Update currency information by UUID. Only provided fields will be updated. Requires JWT authentication.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Currency UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateCurrencyDto })
  @ApiResponse({
    status: 200,
    description: 'Currency successfully updated.',
    type: CurrencyResponseDto,
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
    description: 'Not Found - Currency with specified ID does not exist.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<CurrencyResponseDto> {
    return this.currencyService.update(id, updateCurrencyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete currency',
    description:
      'Delete a currency by UUID. Permanently removes the currency from the system. Requires JWT authentication.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Currency UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Currency successfully deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Currency with specified ID does not exist.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.currencyService.delete(id);
  }
}
