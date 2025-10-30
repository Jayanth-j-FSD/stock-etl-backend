import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  Length,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 3, { message: 'Currency code must be exactly 3 characters' })
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  exchangeRate: number;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3, { message: 'Base currency must be exactly 3 characters' })
  baseCurrency: string;

  @IsDateString()
  @IsOptional()
  lastUpdated?: Date;
}
