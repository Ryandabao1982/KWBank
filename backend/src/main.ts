import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({ origin: '*' });
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend listening on ${port}`);
}
void bootstrap();
