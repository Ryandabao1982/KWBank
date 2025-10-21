import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NamingController } from './naming.controller';
import { NamingService } from './naming.service';
import { NamingRule } from '../entities/naming-rule.entity';
import { Brand } from '../entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NamingRule, Brand])],
  controllers: [NamingController],
  providers: [NamingService],
  exports: [NamingService],
})
export class NamingModule {}
