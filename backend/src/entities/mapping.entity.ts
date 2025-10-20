import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('mappings')
export class Mapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  asin: string;

  @Column({ type: 'text' })
  keyword: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  campaign_id: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  ad_group: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  bid_override: number;

  @Column({ type: 'text', default: '' })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Product, product => product.mappings)
  @JoinColumn({ name: 'asin' })
  product: Product;
}
