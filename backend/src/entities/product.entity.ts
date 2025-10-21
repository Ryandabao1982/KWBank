import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Brand } from './brand.entity';
import { Mapping } from './mapping.entity';

@Entity('products')
export class Product {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  asin: string;

  @Column({ type: 'varchar', length: 100 })
  brand_id: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  product_name: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  category: string;

  @Column({ type: 'text', default: '' })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @OneToMany(() => Mapping, (mapping) => mapping.product)
  mappings: Mapping[];
}
