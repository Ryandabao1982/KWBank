import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DedupeService } from './dedupe.service';

@Controller('dedupe')
export class DedupeController {
  constructor(private readonly dedupeService: DedupeService) {}

  @Get('exact')
  async findExactDuplicates(@Query('brand_id') brand_id?: string) {
    return this.dedupeService.findExactDuplicates(brand_id);
  }

  @Get('conflicts')
  async findConflicts(@Query('brand_id') brand_id?: string) {
    return this.dedupeService.findConflicts(brand_id);
  }

  @Get('fuzzy')
  async findFuzzyDuplicates(
    @Query('brand_id') brand_id?: string,
    @Query('threshold') threshold?: string,
  ) {
    const thresholdNum = threshold ? parseFloat(threshold) : 0.85;
    return this.dedupeService.findFuzzyDuplicates(brand_id, thresholdNum);
  }

  @Post('merge')
  async mergeDuplicates(
    @Body('keep_id') keepId: string,
    @Body('delete_ids') deleteIds: string[],
  ) {
    return this.dedupeService.mergeDuplicates(keepId, deleteIds);
  }
}
