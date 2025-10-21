import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImportService } from './import.service';
import { CreateImportDto } from './dto/import.dto';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `import-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return callback(
            new BadRequestException('Only CSV files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('brand_id') brand_id?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const createImportDto: CreateImportDto = {
      filename: file.originalname,
      brand_id,
    };

    const importRecord = await this.importService.create(createImportDto);

    // TODO: Enqueue job for processing
    // await this.queueService.addImportJob({
    //   import_id: importRecord.id,
    //   file_path: file.path,
    //   brand_id,
    // });

    return {
      message: 'File uploaded successfully',
      import: importRecord,
      job_id: importRecord.id,
    };
  }

  @Get()
  async findAll() {
    return this.importService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.importService.findOne(id);
  }

  @Get(':id/status')
  async getStatus(@Param('id') id: string) {
    const importRecord = await this.importService.findOne(id);
    return {
      id: importRecord.id,
      status: importRecord.status,
      total_rows: importRecord.total_rows,
      processed_rows: importRecord.processed_rows,
      successful_rows: importRecord.successful_rows,
      failed_rows: importRecord.failed_rows,
      error_message: importRecord.error_message,
    };
  }
}
