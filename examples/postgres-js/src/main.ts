/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = await app.listen(0);
  const port = server.address().port;

  console.log(
    `\nApp successfully bootstrapped. You can try running:

    curl http://127.0.0.1:${port}`
  );

  // 以下是一些额外的信息
  console.log(`\n${port} 是随机端口，每次启动都会变化`);
  console.log('\n drizzle 使用 postgres-js 成功链接数据库！');
}

bootstrap();
