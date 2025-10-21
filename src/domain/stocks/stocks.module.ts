import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './stock.entity';
import { StockService } from './stock.service';
import { StockRepository } from './stock.repository';
import { StocksController } from '../../application/controllers/stocks.controller';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stock]), AuthModule, DatabaseModule],
  controllers: [StocksController],
  providers: [StockService, StockRepository],
  exports: [StockService, StockRepository],
})
export class StocksModule {}
