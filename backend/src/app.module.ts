import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { KeywordsModule } from './keywords/keywords.module';
import { MappingsModule } from './mappings/mappings.module';
import configuration from './config/configuration';
import { Brand } from './entities/brand.entity';
import { Product } from './entities/product.entity';
import { Keyword } from './entities/keyword.entity';
import { Mapping } from './entities/mapping.entity';
import { NamingRule } from './entities/naming-rule.entity';
import { AuditEntry } from './entities/audit-entry.entity';

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
        entities: [Brand, Product, Keyword, Mapping, NamingRule, AuditEntry],
        synchronize: true, // Set to false in production
        logging: process.env.NODE_ENV === 'development',
      }),
      inject: [ConfigService],
    }),
    BrandsModule,
    ProductsModule,
    KeywordsModule,
    MappingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
