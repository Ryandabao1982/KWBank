import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from '../entities/keyword.entity';

export interface DuplicateResult {
  normalized_text: string;
  brand_id: string;
  keyword_type: string;
  match_type: string;
  count: number;
  keyword_ids: string[];
}

export interface FuzzyDuplicateResult {
  keyword1_id: string;
  keyword1_text: string;
  keyword2_id: string;
  keyword2_text: string;
  similarity: number;
}

@Injectable()
export class DedupeService {
  constructor(
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
  ) {}

  /**
   * Find exact duplicates based on normalized text, brand, type, and match type
   */
  async findExactDuplicates(brand_id?: string): Promise<DuplicateResult[]> {
    const query = this.keywordRepository
      .createQueryBuilder('k')
      .select('k.normalized_text', 'normalized_text')
      .addSelect('k.brand_id', 'brand_id')
      .addSelect('k.keyword_type', 'keyword_type')
      .addSelect('k.match_type', 'match_type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('array_agg(k.id)', 'keyword_ids')
      .groupBy('k.normalized_text')
      .addGroupBy('k.brand_id')
      .addGroupBy('k.keyword_type')
      .addGroupBy('k.match_type')
      .having('COUNT(*) > 1');

    if (brand_id) {
      query.where('k.brand_id = :brand_id', { brand_id });
    }

    return query.getRawMany();
  }

  /**
   * Find conflicts - keywords that are both positive and negative for the same brand
   */
  async findConflicts(brand_id?: string): Promise<any[]> {
    const query = this.keywordRepository
      .createQueryBuilder('k1')
      .select([
        'k1.id as positive_id',
        'k1.text as keyword_text',
        'k1.normalized_text as normalized_text',
        'k1.brand_id as brand_id',
        'k1.match_type as match_type',
        'k2.id as negative_id',
      ])
      .innerJoin(
        'keywords',
        'k2',
        'k1.normalized_text = k2.normalized_text AND k1.brand_id = k2.brand_id AND k1.match_type = k2.match_type',
      )
      .where("k1.keyword_type = 'positive'")
      .andWhere("k2.keyword_type = 'negative'");

    if (brand_id) {
      query.andWhere('k1.brand_id = :brand_id', { brand_id });
    }

    return query.getRawMany();
  }

  /**
   * Normalize text for comparison
   */
  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Calculate Jaro-Winkler similarity between two strings
   * This is a placeholder - in production, use a library like 'natural' or call Python NLP service
   */
  calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1.0;

    const len1 = str1.length;
    const len2 = str2.length;

    if (len1 === 0 || len2 === 0) return 0.0;

    // Simple Levenshtein-based similarity for now
    const maxLen = Math.max(len1, len2);
    const distance = this.levenshteinDistance(str1, str2);
    return 1 - distance / maxLen;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Find fuzzy duplicates using similarity threshold
   * TODO: This should be moved to a background job for large datasets
   */
  async findFuzzyDuplicates(
    brand_id?: string,
    threshold: number = 0.85,
  ): Promise<FuzzyDuplicateResult[]> {
    // Get all keywords for comparison
    const keywords = await this.keywordRepository.find({
      where: brand_id ? { brand_id } : {},
      select: ['id', 'text', 'normalized_text'],
    });

    const results: FuzzyDuplicateResult[] = [];

    // Compare each keyword with others
    for (let i = 0; i < keywords.length; i++) {
      for (let j = i + 1; j < keywords.length; j++) {
        const similarity = this.calculateSimilarity(
          keywords[i].normalized_text,
          keywords[j].normalized_text,
        );

        if (similarity >= threshold && similarity < 1.0) {
          results.push({
            keyword1_id: keywords[i].id,
            keyword1_text: keywords[i].text,
            keyword2_id: keywords[j].id,
            keyword2_text: keywords[j].text,
            similarity,
          });
        }
      }
    }

    return results;
  }

  /**
   * Merge duplicate keywords (keep one, delete others)
   */
  async mergeDuplicates(
    keepId: string,
    deleteIds: string[],
  ): Promise<{ kept: string; deleted: number }> {
    // Delete duplicate keywords
    await this.keywordRepository.delete(deleteIds);

    return {
      kept: keepId,
      deleted: deleteIds.length,
    };
  }
}
