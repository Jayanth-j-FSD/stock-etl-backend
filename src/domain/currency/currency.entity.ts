import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 3 })
  code: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 18, scale: 6 })
  exchangeRate: number;

  @Column({ length: 3 })
  baseCurrency: string;

  @Column({ type: 'timestamp' })
  lastUpdated: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
