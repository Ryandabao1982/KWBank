import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Keyword, MatchType, KeywordType, KeywordIntent, KeywordStatus } from '../entities/keyword.entity';
import { CreateKeywordDto, UpdateKeywordDto, KeywordFilters } from './dto/keyword.dto';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(Keyword)
    private keywordsRepository: Repository<Keyword>,
  ) {}

  private normalizeText(text: string): string {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  async findAll(filters?: KeywordFilters): Promise<Keyword[]> {
    const where: any = {};
    
    if (filters?.brand_id) where.brand_id = filters.brand_id;
    if (filters?.keyword_type) where.keyword_type = filters.keyword_type;
    if (filters?.match_type) where.match_type = filters.match_type;
    if (filters?.intent) where.intent = filters.intent;
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where.normalized_text = Like(`%${this.normalizeText(filters.search)}%`);
    }
    
    return this.keywordsRepository.find({
      where,
      relations: ['brand'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Keyword> {
    const keyword = await this.keywordsRepository.findOne({
      where: { id },
      relations: ['brand'],
    });
    
    if (!keyword) {
      throw new NotFoundException(`Keyword with ID "${id}" not found`);
    }
    
    return keyword;
  }

  async create(createKeywordDto: CreateKeywordDto): Promise<Keyword> {
    const normalized_text = createKeywordDto.normalized_text || this.normalizeText(createKeywordDto.text);
    
    const keyword = this.keywordsRepository.create({
      ...createKeywordDto,
      normalized_text,
    });
    
    return this.keywordsRepository.save(keyword);
  }

  async createBatch(createKeywordDtos: CreateKeywordDto[]): Promise<Keyword[]> {
    const keywords = createKeywordDtos.map(dto => {
      const normalized_text = dto.normalized_text || this.normalizeText(dto.text);
      return this.keywordsRepository.create({
        ...dto,
        normalized_text,
      });
    });
    
    return this.keywordsRepository.save(keywords);
  }

  async update(id: string, updateKeywordDto: UpdateKeywordDto): Promise<Keyword> {
    const keyword = await this.findOne(id);
    
    if (updateKeywordDto.text) {
      keyword.normalized_text = this.normalizeText(updateKeywordDto.text);
    }
    
    Object.assign(keyword, updateKeywordDto);
    return this.keywordsRepository.save(keyword);
  }

  async remove(id: string): Promise<void> {
    const keyword = await this.findOne(id);
    await this.keywordsRepository.remove(keyword);
  }

  async findDuplicates(brand_id?: string): Promise<any[]> {
    const query = this.keywordsRepository
      .createQueryBuilder('keyword')
      .select('keyword.normalized_text', 'normalized_text')
      .addSelect('keyword.keyword_type', 'keyword_type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('array_agg(keyword.text)', 'variants')
      .groupBy('keyword.normalized_text')
      .addGroupBy('keyword.keyword_type')
      .having('COUNT(*) > 1');
    
    if (brand_id) {
      query.where('keyword.brand_id = :brand_id', { brand_id });
    }
    
    return query.getRawMany();
  }

  async findConflicts(brand_id?: string): Promise<any[]> {
    const query = this.keywordsRepository
      .createQueryBuilder('k1')
      .select('k1.normalized_text', 'normalized_text')
      .addSelect('k1.brand_id', 'brand_id')
      .addSelect('array_agg(DISTINCT k1.text)', 'positive_keywords')
      .innerJoin(
        Keyword,
        'k2',
        'k1.normalized_text = k2.normalized_text AND k1.brand_id = k2.brand_id AND k1.keyword_type != k2.keyword_type'
      )
      .where('k1.keyword_type = :positive', { positive: KeywordType.POSITIVE })
      .andWhere('k2.keyword_type = :negative', { negative: KeywordType.NEGATIVE })
      .groupBy('k1.normalized_text')
      .addGroupBy('k1.brand_id');
    
    if (brand_id) {
      query.andWhere('k1.brand_id = :brand_id', { brand_id });
    }
    
    return query.getRawMany();
  }

  async count(filters?: KeywordFilters): Promise<number> {
    const where: any = {};
    
    if (filters?.brand_id) where.brand_id = filters.brand_id;
    if (filters?.keyword_type) where.keyword_type = filters.keyword_type;
    if (filters?.match_type) where.match_type = filters.match_type;
    if (filters?.intent) where.intent = filters.intent;
    if (filters?.status) where.status = filters.status;
    
    return this.keywordsRepository.count({ where });
  }

  async getStats(brand_id?: string): Promise<any> {
    const where = brand_id ? { brand_id } : {};
    
    const [total, positive, negative] = await Promise.all([
      this.keywordsRepository.count({ where }),
      this.keywordsRepository.count({ where: { ...where, keyword_type: KeywordType.POSITIVE } }),
      this.keywordsRepository.count({ where: { ...where, keyword_type: KeywordType.NEGATIVE } }),
    ]);
    
    return {
      total,
      positive,
      negative,
      by_match_type: {
        exact: await this.keywordsRepository.count({ where: { ...where, match_type: MatchType.EXACT } }),
        phrase: await this.keywordsRepository.count({ where: { ...where, match_type: MatchType.PHRASE } }),
        broad: await this.keywordsRepository.count({ where: { ...where, match_type: MatchType.BROAD } }),
      },
      by_intent: {
        awareness: await this.keywordsRepository.count({ where: { ...where, intent: KeywordIntent.AWARENESS } }),
        consideration: await this.keywordsRepository.count({ where: { ...where, intent: KeywordIntent.CONSIDERATION } }),
        conversion: await this.keywordsRepository.count({ where: { ...where, intent: KeywordIntent.CONVERSION } }),
        unknown: await this.keywordsRepository.count({ where: { ...where, intent: KeywordIntent.UNKNOWN } }),
      },
    };
  }
}
