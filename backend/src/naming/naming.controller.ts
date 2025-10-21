import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { NamingService } from './naming.service';
import {
  CreateNamingRuleDto,
  UpdateNamingRuleDto,
  GenerateCampaignNameDto,
  GenerateAdGroupNameDto,
} from './dto/naming.dto';

@Controller('naming')
export class NamingController {
  constructor(private readonly namingService: NamingService) {}

  @Post('rules')
  async create(@Body() createDto: CreateNamingRuleDto) {
    return this.namingService.create(createDto);
  }

  @Get('rules')
  async findAll() {
    return this.namingService.findAll();
  }

  @Get('rules/:id')
  async findOne(@Param('id') id: string) {
    return this.namingService.findOne(id);
  }

  @Put('rules/:id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNamingRuleDto,
  ) {
    return this.namingService.update(id, updateDto);
  }

  @Delete('rules/:id')
  async remove(@Param('id') id: string) {
    await this.namingService.remove(id);
    return { message: 'Naming rule deleted successfully' };
  }

  @Post('generate/campaign')
  async generateCampaignName(@Body() dto: GenerateCampaignNameDto) {
    const name = await this.namingService.generateCampaignName(dto);
    return { name };
  }

  @Post('generate/adgroup')
  generateAdGroupName(@Body() dto: GenerateAdGroupNameDto) {
    const name = this.namingService.generateAdGroupName(dto);
    return { name };
  }

  @Post('preview')
  previewPattern(
    @Body('pattern') pattern: string,
    @Body('sample_data') sampleData?: Record<string, any>,
  ) {
    const preview = this.namingService.previewPattern(pattern, sampleData);
    return { pattern, preview };
  }
}
