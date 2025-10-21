import { Expose } from 'class-transformer';

export class StockResponseDto {
  @Expose()
  id: string;

  @Expose()
  symbol: string;

  @Expose()
  name: string;

  @Expose()
  market: string;

  @Expose()
  price: number;

  @Expose()
  lastUpdated: Date;

  @Expose()
  sector: string;

  @Expose()
  industry: string;

  @Expose()
  marketCap: number;

  @Expose()
  dayHigh: number;

  @Expose()
  dayLow: number;

  @Expose()
  openPrice: number;

  @Expose()
  previousClose: number;

  @Expose()
  volume: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<StockResponseDto>) {
    Object.assign(this, partial);
  }
}
