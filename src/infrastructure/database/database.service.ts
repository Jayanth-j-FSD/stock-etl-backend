import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async checkConnection(): Promise<boolean> {
    try {
      if (this.dataSource.isInitialized) {
        return true;
      }
      await this.dataSource.initialize();
      return true;
    } catch (error) {
      console.error('Database connection error:', error);
      return false;
    }
  }

  async getConnectionStatus(): Promise<{
    isConnected: boolean;
    database: string;
    host: string;
  }> {
    const isConnected = this.dataSource.isInitialized;
    const { database, host } = this.dataSource.options as any;

    return {
      isConnected,
      database,
      host,
    };
  }
}
