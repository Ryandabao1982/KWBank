import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateAuditEntryDto {
  @IsString()
  action: string;

  @IsOptional()
  @IsString()
  entity_type?: string;

  @IsOptional()
  @IsString()
  entity_id?: string;

  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}

export class AuditFilters {
  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  entity_type?: string;

  @IsOptional()
  @IsString()
  entity_id?: string;

  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;
}
