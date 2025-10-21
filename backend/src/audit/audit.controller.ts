import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { AuditService } from './audit.service';
import { CreateAuditEntryDto, AuditFilters } from './dto/audit.dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  async log(@Body() createDto: CreateAuditEntryDto) {
    return this.auditService.log(createDto);
  }

  @Get()
  async findAll(@Query() filters: AuditFilters) {
    return this.auditService.findAll(filters);
  }

  @Get('recent')
  async getRecent(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 50;
    return this.auditService.getRecent(limitNum);
  }

  @Get('stats')
  async getStats() {
    return this.auditService.getStats();
  }

  @Get('entity/:type/:id')
  async getEntityHistory(
    @Param('type') entity_type: string,
    @Param('id') entity_id: string,
  ) {
    return this.auditService.getEntityHistory(entity_type, entity_id);
  }
}
