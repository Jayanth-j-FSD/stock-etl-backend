import { Expose } from 'class-transformer';

export class CurrencyResponseDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  exchangeRate: number;

  @Expose()
  baseCurrency: string;

  @Expose()
  lastUpdated: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
