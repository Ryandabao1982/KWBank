import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('audit_entries')
export class AuditEntry {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'jsonb' })
  details: Record<string, any>;

  @Column({ type: 'varchar', length: 100, default: 'system' })
  user: string;
}
