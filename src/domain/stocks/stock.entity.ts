import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 10 })
  symbol: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  market: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'timestamp', nullable: true })
  lastUpdated: Date;

  @Column({ nullable: true })
  sector: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ type: 'bigint', nullable: true })
  marketCap: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  dayHigh: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  dayLow: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  openPrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  previousClose: number;

  @Column({ type: 'bigint', nullable: true })
  volume: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
