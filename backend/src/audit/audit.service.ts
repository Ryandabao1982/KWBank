import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { AuditEntry } from '../entities/audit-entry.entity';
import { CreateAuditEntryDto, AuditFilters } from './dto/audit.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditEntry)
    private auditRepository: Repository<AuditEntry>,
  ) {}

  /**
   * Create a new audit entry
   */
  async log(createDto: CreateAuditEntryDto): Promise<AuditEntry> {
    const entry = this.auditRepository.create(createDto);
    return this.auditRepository.save(entry);
  }

  /**
   * Find all audit entries with optional filters
   */
  async findAll(filters?: AuditFilters): Promise<AuditEntry[]> {
    const where: FindOptionsWhere<AuditEntry> = {};

    if (filters?.action) where.action = filters.action;
    if (filters?.entity_type) where.entity_type = filters.entity_type;
    if (filters?.entity_id) where.entity_id = filters.entity_id;
    if (filters?.user) where.user = filters.user;

    // Handle date range
    if (filters?.start_date && filters?.end_date) {
      where.timestamp = Between(
        new Date(filters.start_date),
        new Date(filters.end_date),
      );
    } else if (filters?.start_date) {
      // If only start date, get entries from start date onwards
      where.timestamp = Between(new Date(filters.start_date), new Date());
    }

    return this.auditRepository.find({
      where,
      order: { timestamp: 'DESC' },
      take: 1000, // Limit to prevent large queries
    });
  }

  /**
   * Get recent audit entries
   */
  async getRecent(limit: number = 50): Promise<AuditEntry[]> {
    return this.auditRepository.find({
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get audit entries for a specific entity
   */
  async getEntityHistory(
    entity_type: string,
    entity_id: string,
  ): Promise<AuditEntry[]> {
    return this.auditRepository.find({
      where: { entity_type, entity_id },
      order: { timestamp: 'DESC' },
    });
  }

  /**
   * Get audit statistics
   */
  async getStats(): Promise<any> {
    const total = await this.auditRepository.count();

    const byAction = await this.auditRepository
      .createQueryBuilder('audit')
      .select('action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('action')
      .orderBy('count', 'DESC')
      .getRawMany();

    const byUser = await this.auditRepository
      .createQueryBuilder('audit')
      .select('user')
      .addSelect('COUNT(*)', 'count')
      .where('user IS NOT NULL')
      .groupBy('user')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      total,
      by_action: byAction,
      by_user: byUser,
    };
  }
}
