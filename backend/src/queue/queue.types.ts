export const IMPORT_QUEUE = 'import-queue';
export const EXPORT_QUEUE = 'export-queue';

export interface ImportJobData {
  import_id: string;
  file_path: string;
  brand_id?: string;
}

export interface ExportJobData {
  export_id: string;
  brand_id: string;
  format: 'csv' | 'json';
  filters?: Record<string, any>;
}
