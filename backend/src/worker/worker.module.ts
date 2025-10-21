import { Module } from '@nestjs/common';
import { ImportProcessor } from './import.processor';
import { ExportProcessor } from './export.processor';

@Module({
  providers: [ImportProcessor, ExportProcessor],
})
export class WorkerModule {}
