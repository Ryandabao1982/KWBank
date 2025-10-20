import { IsString, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  asin: string;

  @IsString()
  brand_id: string;

  @IsOptional()
  @IsString()
  product_name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  product_name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
