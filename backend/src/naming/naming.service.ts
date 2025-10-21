import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NamingRule } from '../entities/naming-rule.entity';
import { Brand } from '../entities/brand.entity';
import {
  CreateNamingRuleDto,
  UpdateNamingRuleDto,
  GenerateCampaignNameDto,
  GenerateAdGroupNameDto,
} from './dto/naming.dto';

@Injectable()
export class NamingService {
  constructor(
    @InjectRepository(NamingRule)
    private namingRuleRepository: Repository<NamingRule>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async create(createDto: CreateNamingRuleDto): Promise<NamingRule> {
    const rule = this.namingRuleRepository.create(createDto);
    return this.namingRuleRepository.save(rule);
  }

  async findAll(): Promise<NamingRule[]> {
    return this.namingRuleRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<NamingRule> {
    const rule = await this.namingRuleRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`Naming rule with ID ${id} not found`);
    }
    return rule;
  }

  async update(
    id: string,
    updateDto: UpdateNamingRuleDto,
  ): Promise<NamingRule> {
    const rule = await this.findOne(id);
    Object.assign(rule, updateDto);
    return this.namingRuleRepository.save(rule);
  }

  async remove(id: string): Promise<void> {
    const rule = await this.findOne(id);
    await this.namingRuleRepository.remove(rule);
  }

  /**
   * Generate a campaign name using pattern tokens
   * Example pattern: "{BrandPrefix}_{Strategy}_{ASINCount}ASIN_{Date:yyyyMMdd}"
   * Example output: "NIKE_EXACT_3ASIN_20251021"
   */
  async generateCampaignName(dto: GenerateCampaignNameDto): Promise<string> {
    const brand = await this.brandRepository.findOne({
      where: { brand_id: dto.brand_id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand ${dto.brand_id} not found`);
    }

    // Use provided pattern or default pattern
    const pattern =
      dto.pattern || '{BrandPrefix}_{Strategy}_{ASINCount}ASIN_{Date:yyyyMMdd}';

    let name = pattern;

    // Replace tokens
    name = name.replace(
      '{BrandPrefix}',
      brand.prefix || brand.brand_id.toUpperCase(),
    );
    name = name.replace('{Brand}', brand.name);
    name = name.replace('{Strategy}', dto.strategy.toUpperCase());
    name = name.replace('{ASINCount}', (dto.asin_count || 0).toString());

    // Date formatting
    const dateMatch = name.match(/\{Date:([^}]+)\}/);
    if (dateMatch) {
      const format = dateMatch[1];
      const dateStr = this.formatDate(new Date(), format);
      name = name.replace(dateMatch[0], dateStr);
    }

    // Simple {Date} without format
    name = name.replace('{Date}', this.formatDate(new Date(), 'yyyyMMdd'));

    return name;
  }

  /**
   * Generate an ad group name
   * Example pattern: "AG_{ASIN}_{KeywordCount}kw"
   * Example output: "AG_B08N5WRWNW_15kw"
   */
  generateAdGroupName(dto: GenerateAdGroupNameDto): string {
    const pattern = 'AG_{ASIN}_{KeywordCount}kw';
    let name = pattern;

    name = name.replace('{ASIN}', dto.asin);
    name = name.replace('{KeywordCount}', (dto.keyword_count || 0).toString());

    return name;
  }

  /**
   * Format date according to pattern
   * Supports: yyyy, MM, dd, HH, mm, ss
   */
  private formatDate(date: Date, format: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('yyyy', year.toString())
      .replace('MM', month)
      .replace('dd', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Preview a naming pattern with sample data
   */
  previewPattern(pattern: string, sampleData?: Record<string, any>): string {
    const data = sampleData || {
      brand_id: 'nike',
      brand_name: 'Nike',
      prefix: 'NIKE',
      strategy: 'EXACT',
      asin_count: 3,
      asin: 'B08N5WRWNW',
      keyword_count: 15,
    };

    let preview = pattern;

    // Replace all tokens with sample data
    preview = preview.replace('{BrandPrefix}', String(data.prefix));
    preview = preview.replace('{Brand}', String(data.brand_name));
    preview = preview.replace('{Strategy}', String(data.strategy));
    preview = preview.replace('{ASINCount}', String(data.asin_count));
    preview = preview.replace('{ASIN}', String(data.asin));
    preview = preview.replace('{KeywordCount}', String(data.keyword_count));

    // Handle date patterns
    const dateMatch = preview.match(/\{Date:([^}]+)\}/);
    if (dateMatch) {
      const format = dateMatch[1];
      const dateStr = this.formatDate(new Date(), format);
      preview = preview.replace(dateMatch[0], dateStr);
    }
    preview = preview.replace(
      '{Date}',
      this.formatDate(new Date(), 'yyyyMMdd'),
    );

    return preview;
  }
}
