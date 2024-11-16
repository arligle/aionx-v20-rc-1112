import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
// import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const server = await app.listen(0);
  const port = server.address().port;

  console.log(
    `\nApp successfully bootstrapped. You can try running:

    curl http://127.0.0.1:${port}`
  );

  // 以下是一些额外的信息
  console.log(`\n这是一个简单的Nest应用，以下是一些额外的信息：

    ${port} 是随机端口，每次启动都会变化`);
  console.log('\n    当前 node.js 的工作目录:' + process.cwd());
  console.log('\n    当前启动文件（main.ts）所在目录：' + __dirname);
  // console.log('\n    main.ts 文件的上一级目录为：' + join(__dirname, '..'));
  console.log('\n    --- 以上信息对你设置环境变量、调试、配置文件等或许有帮助 ---');
}
bootstrap().catch(console.error);
