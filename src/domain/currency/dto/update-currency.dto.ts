import { IsOptional, IsString, IsNumber, IsPositive, Length, IsDateString } from 'class-validator';

export class UpdateCurrencyDto {
  @IsString()
  @IsOptional()
  @Length(3, 3, { message: 'Currency code must be exactly 3 characters' })
  code?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  exchangeRate?: number;

  @IsString()
  @IsOptional()
  @Length(3, 3, { message: 'Base currency must be exactly 3 characters' })
  baseCurrency?: string;

  @IsDateString()
  @IsOptional()
  lastUpdated?: Date;
}
