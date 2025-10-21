import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Mapping } from '../entities/mapping.entity';
import { CreateMappingDto, UpdateMappingDto } from './dto/mapping.dto';

@Injectable()
export class MappingsService {
  constructor(
    @InjectRepository(Mapping)
    private mappingsRepository: Repository<Mapping>,
  ) {}

  async findAll(asin?: string, keyword?: string): Promise<Mapping[]> {
    const where: FindOptionsWhere<Mapping> = {};
    if (asin) where.asin = asin;
    if (keyword) where.keyword = keyword;

    const mappings = await this.mappingsRepository.find({
      where,
      relations: ['product'],
      order: { created_at: 'DESC' },
    });
    return mappings;
  }

  async findOne(id: string): Promise<Mapping> {
    const mapping = await this.mappingsRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!mapping) {
      throw new NotFoundException(`Mapping with ID "${id}" not found`);
    }

    return mapping;
  }

  async create(createMappingDto: CreateMappingDto): Promise<Mapping> {
    const mapping = this.mappingsRepository.create(createMappingDto);
    return this.mappingsRepository.save(mapping);
  }

  async update(
    id: string,
    updateMappingDto: UpdateMappingDto,
  ): Promise<Mapping> {
    const mapping = await this.findOne(id);
    Object.assign(mapping, updateMappingDto);
    return this.mappingsRepository.save(mapping);
  }

  async remove(id: string): Promise<void> {
    const mapping = await this.findOne(id);
    await this.mappingsRepository.remove(mapping);
  }

  async count(asin?: string): Promise<number> {
    const where = asin ? { asin } : {};
    return this.mappingsRepository.count({ where });
  }
}
