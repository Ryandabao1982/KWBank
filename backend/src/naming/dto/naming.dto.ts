import { IsString, IsOptional } from 'class-validator';

export class CreateNamingRuleDto {
  @IsString()
  name: string;

  @IsString()
  pattern: string;

  @IsOptional()
  @IsString()
  example?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateNamingRuleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  pattern?: string;

  @IsOptional()
  @IsString()
  example?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class GenerateCampaignNameDto {
  @IsString()
  brand_id: string;

  @IsString()
  strategy: string;

  @IsOptional()
  @IsString()
  pattern?: string;

  @IsOptional()
  asin_count?: number;
}

export class GenerateAdGroupNameDto {
  @IsString()
  asin: string;

  @IsOptional()
  keyword_count?: number;
}
