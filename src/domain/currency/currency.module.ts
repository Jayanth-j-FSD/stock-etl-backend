import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './currency.entity';
import { CurrencyService } from './currency.service';
import { CurrencyRepository } from './currency.repository';
import { CurrencyController } from '../../application/controllers/currency.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  controllers: [CurrencyController],
  providers: [CurrencyService, CurrencyRepository],
  exports: [CurrencyService, CurrencyRepository],
})
export class CurrencyModule {}
