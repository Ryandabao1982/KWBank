import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { Keyword } from './keyword.entity';

@Entity('brands')
export class Brand {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  brand_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  prefix: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 10.0 })
  default_budget: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.75 })
  default_bid: number;

  @Column({ type: 'varchar', length: 100, default: '' })
  account_id: string;

  @Column({ type: 'varchar', length: 10, default: 'en_US' })
  default_locale: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Product, product => product.brand)
  products: Product[];

  @OneToMany(() => Keyword, keyword => keyword.brand)
  keywords: Keyword[];
}
