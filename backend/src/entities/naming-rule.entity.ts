import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('naming_rules')
export class NamingRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  pattern: string;

  @Column({ type: 'text', default: '' })
  example: string;

  @Column({ type: 'varchar', length: 100, default: 'default' })
  name: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  brand_id: string;

  @CreateDateColumn()
  created_at: Date;
}
