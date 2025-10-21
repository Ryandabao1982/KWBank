import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Brand } from './brand.entity';

export enum MatchType {
  EXACT = 'exact',
  PHRASE = 'phrase',
  BROAD = 'broad',
}

export enum KeywordType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

export enum KeywordIntent {
  AWARENESS = 'awareness',
  CONSIDERATION = 'consideration',
  CONVERSION = 'conversion',
  UNKNOWN = 'unknown',
}

export enum KeywordStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
  PENDING = 'pending',
}

@Entity('keywords')
export class Keyword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar', length: 100 })
  brand_id: string;

  @Column({ type: 'enum', enum: MatchType })
  match_type: MatchType;

  @Column({ type: 'enum', enum: KeywordType })
  keyword_type: KeywordType;

  @Column({ type: 'text' })
  normalized_text: string;

  @Column({ type: 'enum', enum: KeywordIntent, default: KeywordIntent.UNKNOWN })
  intent: KeywordIntent;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  suggested_bid: number;

  @Column({ type: 'simple-array', default: '' })
  tags: string[];

  @Column({ type: 'text', default: '' })
  notes: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  owner: string;

  @Column({ type: 'enum', enum: KeywordStatus, default: KeywordStatus.ACTIVE })
  status: KeywordStatus;

  @Column({ type: 'varchar', length: 255, default: '' })
  source: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Brand, (brand) => brand.keywords)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;
}
