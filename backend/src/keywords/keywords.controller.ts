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
import { KeywordsService } from './keywords.service';
import {
  Keyword,
  MatchType,
  KeywordType,
  KeywordIntent,
  KeywordStatus,
} from '../entities/keyword.entity';
import {
  CreateKeywordDto,
  UpdateKeywordDto,
  KeywordFilters,
} from './dto/keyword.dto';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Get()
  async findAll(
    @Query('brand_id') brand_id?: string,
    @Query('keyword_type') keyword_type?: KeywordType,
    @Query('match_type') match_type?: MatchType,
    @Query('intent') intent?: KeywordIntent,
    @Query('status') status?: KeywordStatus,
    @Query('search') search?: string,
  ): Promise<Keyword[]> {
    const filters: KeywordFilters = {
      brand_id,
      keyword_type,
      match_type,
      intent,
      status,
      search,
    };
    return this.keywordsService.findAll(filters);
  }

  @Get('stats')
  async getStats(@Query('brand_id') brand_id?: string): Promise<any> {
    return this.keywordsService.getStats(brand_id);
  }

  @Get('duplicates')
  async findDuplicates(@Query('brand_id') brand_id?: string): Promise<any[]> {
    return this.keywordsService.findDuplicates(brand_id);
  }

  @Get('conflicts')
  async findConflicts(@Query('brand_id') brand_id?: string): Promise<any[]> {
    return this.keywordsService.findConflicts(brand_id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Keyword> {
    return this.keywordsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createKeywordDto: CreateKeywordDto): Promise<Keyword> {
    return this.keywordsService.create(createKeywordDto);
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  async createBatch(
    @Body() createKeywordDtos: CreateKeywordDto[],
  ): Promise<Keyword[]> {
    return this.keywordsService.createBatch(createKeywordDtos);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateKeywordDto: UpdateKeywordDto,
  ): Promise<Keyword> {
    return this.keywordsService.update(id, updateKeywordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.keywordsService.remove(id);
  }
}
