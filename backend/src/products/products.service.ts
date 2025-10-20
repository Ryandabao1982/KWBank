import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(brand_id?: string): Promise<Product[]> {
    const where = brand_id ? { brand_id } : {};
    return this.productsRepository.find({
      where,
      relations: ['brand', 'mappings'],
    });
  }

  async findOne(asin: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { asin },
      relations: ['brand', 'mappings'],
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ASIN "${asin}" not found`);
    }
    
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productsRepository.findOne({
      where: { asin: createProductDto.asin },
    });
    
    if (existingProduct) {
      throw new ConflictException(`Product with ASIN "${createProductDto.asin}" already exists`);
    }
    
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async update(asin: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(asin);
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(asin: string): Promise<void> {
    const product = await this.findOne(asin);
    await this.productsRepository.remove(product);
  }

  async count(brand_id?: string): Promise<number> {
    const where = brand_id ? { brand_id } : {};
    return this.productsRepository.count({ where });
  }
}
