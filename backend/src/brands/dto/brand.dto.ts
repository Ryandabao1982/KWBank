import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  brand_id: string;

  @IsString()
  name: string;

  @IsString()
  prefix: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  default_budget?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  default_bid?: number;

  @IsOptional()
  @IsString()
  account_id?: string;

  @IsOptional()
  @IsString()
  default_locale?: string;
}

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  prefix?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  default_budget?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  default_bid?: number;

  @IsOptional()
  @IsString()
  account_id?: string;

  @IsOptional()
  @IsString()
  default_locale?: string;
}
