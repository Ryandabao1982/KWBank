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
import { MappingsService } from './mappings.service';
import { Mapping } from '../entities/mapping.entity';
import { CreateMappingDto, UpdateMappingDto } from './dto/mapping.dto';

@Controller('mappings')
export class MappingsController {
  constructor(private readonly mappingsService: MappingsService) {}

  @Get()
  async findAll(
    @Query('asin') asin?: string,
    @Query('keyword') keyword?: string,
  ): Promise<Mapping[]> {
    return this.mappingsService.findAll(asin, keyword);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Mapping> {
    return this.mappingsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMappingDto: CreateMappingDto): Promise<Mapping> {
    return this.mappingsService.create(createMappingDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMappingDto: UpdateMappingDto,
  ): Promise<Mapping> {
    return this.mappingsService.update(id, updateMappingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.mappingsService.remove(id);
  }
}
