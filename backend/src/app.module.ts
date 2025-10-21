import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { KeywordsModule } from './keywords/keywords.module';
import { MappingsModule } from './mappings/mappings.module';
import { ImportModule } from './import/import.module';
import { DedupeModule } from './dedupe/dedupe.module';
import { NamingModule } from './naming/naming.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { WorkerModule } from './worker/worker.module';
import configuration from './config/configuration';
import { Brand } from './entities/brand.entity';
import { Product } from './entities/product.entity';
import { Keyword } from './entities/keyword.entity';
import { Mapping } from './entities/mapping.entity';
import { NamingRule } from './entities/naming-rule.entity';
import { AuditEntry } from './entities/audit-entry.entity';
import { Import } from './entities/import.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [
          Brand,
          Product,
          Keyword,
          Mapping,
          NamingRule,
          AuditEntry,
          Import,
          User,
        ],
        synchronize: true, // Set to false in production
        logging: process.env.NODE_ENV === 'development',
      }),
      inject: [ConfigService],
    }),
    QueueModule,
    BrandsModule,
    ProductsModule,
    KeywordsModule,
    MappingsModule,
    ImportModule,
    DedupeModule,
    NamingModule,
    AuditModule,
    AuthModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
