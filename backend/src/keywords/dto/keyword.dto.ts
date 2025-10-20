import { IsString, IsEnum, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { MatchType, KeywordType, KeywordIntent, KeywordStatus } from '../../entities/keyword.entity';

export class CreateKeywordDto {
  @IsString()
  text: string;

  @IsString()
  brand_id: string;

  @IsEnum(MatchType)
  match_type: MatchType;

  @IsEnum(KeywordType)
  keyword_type: KeywordType;

  @IsOptional()
  @IsString()
  normalized_text?: string;

  @IsOptional()
  @IsEnum(KeywordIntent)
  intent?: KeywordIntent;

  @IsOptional()
  @IsNumber()
  @Min(0)
  suggested_bid?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsEnum(KeywordStatus)
  status?: KeywordStatus;

  @IsOptional()
  @IsString()
  source?: string;
}

export class UpdateKeywordDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsEnum(MatchType)
  match_type?: MatchType;

  @IsOptional()
  @IsEnum(KeywordType)
  keyword_type?: KeywordType;

  @IsOptional()
  @IsEnum(KeywordIntent)
  intent?: KeywordIntent;

  @IsOptional()
  @IsNumber()
  @Min(0)
  suggested_bid?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsEnum(KeywordStatus)
  status?: KeywordStatus;
}

export interface KeywordFilters {
  brand_id?: string;
  keyword_type?: KeywordType;
  match_type?: MatchType;
  intent?: KeywordIntent;
  status?: KeywordStatus;
  search?: string;
}
