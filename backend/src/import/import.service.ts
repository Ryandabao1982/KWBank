import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Import, ImportStatus } from '../entities/import.entity';
import { CreateImportDto, UpdateImportDto } from './dto/import.dto';

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(Import)
    private importRepository: Repository<Import>,
  ) {}

  async create(createImportDto: CreateImportDto): Promise<Import> {
    const importRecord = this.importRepository.create({
      ...createImportDto,
      status: ImportStatus.PENDING,
    });
    return this.importRepository.save(importRecord);
  }

  async findAll(): Promise<Import[]> {
    return this.importRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Import> {
    const importRecord = await this.importRepository.findOne({
      where: { id },
    });
    if (!importRecord) {
      throw new NotFoundException(`Import with ID ${id} not found`);
    }
    return importRecord;
  }

  async update(id: string, updateImportDto: UpdateImportDto): Promise<Import> {
    const importRecord = await this.findOne(id);
    Object.assign(importRecord, updateImportDto);
    return this.importRepository.save(importRecord);
  }

  async updateStatus(
    id: string,
    status: ImportStatus,
    errorMessage?: string,
  ): Promise<Import> {
    return this.update(id, { status, error_message: errorMessage });
  }

  async updateProgress(
    id: string,
    processed: number,
    successful: number,
    failed: number,
  ): Promise<Import> {
    return this.update(id, {
      processed_rows: processed,
      successful_rows: successful,
      failed_rows: failed,
    });
  }
}
