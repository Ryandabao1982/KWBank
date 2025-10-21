import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportEntity } from './import.entity';
import { Queue } from 'bullmq';

@Injectable()
export class ImportService {
  private queue: Queue;
  constructor(
    @InjectRepository(ImportEntity) private repo: Repository<ImportEntity>,
  ) {
    // lazy require to avoid import at build time
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
    const { Queue: Q } = require('bullmq');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    this.queue = new Q('imports', {
      connection: { host: process.env.REDIS_HOST || 'redis', port: 6379 },
    });
  }

  async createFromBuffer(filename: string, buffer: Buffer) {
    const imp = this.repo.create({
      filename,
      status: 'queued',
      meta: { bytes: buffer.length },
    });
    const saved = await this.repo.save(imp);
    await this.queue.add('process-import', { importId: saved.id, filename });
    return saved;
  }
}
