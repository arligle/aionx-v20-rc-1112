/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Logger } from '@aiofc/logger';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // 设置为 true 时，日志消息将被暂时存储（缓冲）而不是立即输出。
    { bufferLogs: true }
  );
  app.flushLogs(); // 刷新日志：将内存中的日志数据写入到持久存储（如文件或数据库）中

  const logger = app.get(Logger);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
