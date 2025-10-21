import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class CreateStockDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  market?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  sector?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  marketCap?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  dayHigh?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  dayLow?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  openPrice?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  previousClose?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  volume?: number;
}
