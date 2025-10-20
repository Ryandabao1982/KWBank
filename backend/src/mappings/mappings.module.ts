import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MappingsController } from './mappings.controller';
import { MappingsService } from './mappings.service';
import { Mapping } from '../entities/mapping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mapping])],
  controllers: [MappingsController],
  providers: [MappingsService],
  exports: [MappingsService],
})
export class MappingsModule {}
