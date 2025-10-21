import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DedupeController } from './dedupe.controller';
import { DedupeService } from './dedupe.service';
import { Keyword } from '../entities/keyword.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  controllers: [DedupeController],
  providers: [DedupeService],
  exports: [DedupeService],
})
export class DedupeModule {}
