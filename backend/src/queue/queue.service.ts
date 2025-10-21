import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IMPORT_QUEUE, EXPORT_QUEUE, ImportJobData, ExportJobData } from './queue.types';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(IMPORT_QUEUE) private importQueue: Queue,
    @InjectQueue(EXPORT_QUEUE) private exportQueue: Queue,
  ) {}

  async addImportJob(data: ImportJobData): Promise<string> {
    const job = await this.importQueue.add('process-import', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });
    return job.id as string;
  }

  async addExportJob(data: ExportJobData): Promise<string> {
    const job = await this.exportQueue.add('generate-export', data, {
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
    });
    return job.id as string;
  }

  async getImportJobStatus(jobId: string) {
    const job = await this.importQueue.getJob(jobId);
    if (!job) {
      return null;
    }
    return {
      id: job.id,
      state: await job.getState(),
      progress: job.progress,
      data: job.data,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
    };
  }

  async getExportJobStatus(jobId: string) {
    const job = await this.exportQueue.getJob(jobId);
    if (!job) {
      return null;
    }
    return {
      id: job.id,
      state: await job.getState(),
      progress: job.progress,
      data: job.data,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
    };
  }
}
