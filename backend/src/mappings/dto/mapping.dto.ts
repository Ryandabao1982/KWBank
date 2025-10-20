import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateMappingDto {
  @IsString()
  asin: string;

  @IsString()
  keyword: string;

  @IsOptional()
  @IsString()
  campaign_id?: string;

  @IsOptional()
  @IsString()
  ad_group?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bid_override?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMappingDto {
  @IsOptional()
  @IsString()
  campaign_id?: string;

  @IsOptional()
  @IsString()
  ad_group?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bid_override?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
