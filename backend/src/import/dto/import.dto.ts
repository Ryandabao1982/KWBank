import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ImportStatus } from '../../entities/import.entity';

export class CreateImportDto {
  @IsString()
  filename: string;

  @IsOptional()
  @IsString()
  brand_id?: string;

  @IsOptional()
  @IsNumber()
  total_rows?: number;
}

export class UpdateImportDto {
  @IsOptional()
  @IsEnum(ImportStatus)
  status?: ImportStatus;

  @IsOptional()
  @IsNumber()
  processed_rows?: number;

  @IsOptional()
  @IsNumber()
  successful_rows?: number;

  @IsOptional()
  @IsNumber()
  failed_rows?: number;

  @IsOptional()
  @IsString()
  error_message?: string;
}

export class ImportJobDto {
  @IsString()
  import_id: string;

  @IsString()
  file_path: string;

  @IsOptional()
  @IsString()
  brand_id?: string;
}
