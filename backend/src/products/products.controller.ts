import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('brand_id') brand_id?: string): Promise<Product[]> {
    return this.productsService.findAll(brand_id);
  }

  @Get(':asin')
  async findOne(@Param('asin') asin: string): Promise<Product> {
    return this.productsService.findOne(asin);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':asin')
  async update(
    @Param('asin') asin: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(asin, updateProductDto);
  }

  @Delete(':asin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('asin') asin: string): Promise<void> {
    return this.productsService.remove(asin);
  }
}
