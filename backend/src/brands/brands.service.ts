import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  async findAll(): Promise<Brand[]> {
    return this.brandsRepository.find({
      relations: ['products', 'keywords'],
    });
  }

  async findOne(brand_id: string): Promise<Brand> {
    const brand = await this.brandsRepository.findOne({
      where: { brand_id },
      relations: ['products', 'keywords'],
    });
    
    if (!brand) {
      throw new NotFoundException(`Brand with ID "${brand_id}" not found`);
    }
    
    return brand;
  }

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const existingBrand = await this.brandsRepository.findOne({
      where: { brand_id: createBrandDto.brand_id },
    });
    
    if (existingBrand) {
      throw new ConflictException(`Brand with ID "${createBrandDto.brand_id}" already exists`);
    }
    
    const brand = this.brandsRepository.create(createBrandDto);
    return this.brandsRepository.save(brand);
  }

  async update(brand_id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(brand_id);
    Object.assign(brand, updateBrandDto);
    return this.brandsRepository.save(brand);
  }

  async remove(brand_id: string): Promise<void> {
    const brand = await this.findOne(brand_id);
    await this.brandsRepository.remove(brand);
  }

  async count(): Promise<number> {
    return this.brandsRepository.count();
  }
}
