import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './domain/auth/auth.module';
import { UsersModule } from './domain/users/users.module';
import { StocksModule } from './domain/stocks/stocks.module';
import appConfig from './core/config/app.config';
import databaseConfig from './core/config/database.config';
import jwtConfig from './core/config/jwt.config';

@Module({
  imports: [
    // Global configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      envFilePath: ['.env'],
    }),
    // Database module
    DatabaseModule,
    // Auth module
    AuthModule,
    // Users module
    UsersModule,
    // Stocks module
    StocksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
