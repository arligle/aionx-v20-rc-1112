import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@aiofc/logger';
import { AppConfig } from './config/app.config';
import { generateRandomId } from './utils/crypto';
import { FastifyInstance } from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import { applyExpressCompatibility } from './bootstrap/fastify-setup';
import { VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';

const REQUEST_ID_HEADER = 'x-request-id';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    // TODO: 待封装
    new FastifyAdapter({
      /*
      给每一个请求分配一个ID，用于追踪请求：
      1、如果请求已经有了'x-request-id'
      2、否则生成一个随机ID
    */
      genReqId: (req: { headers: { [x: string]: any } }) => {
        const requestId = req.headers[REQUEST_ID_HEADER];
        return requestId || generateRandomId();
      },


      // 设置请求体大小限制，单位为字节
      bodyLimit: 10_485_760,
    }),
    // 设置为 true 时，日志消息将被暂时存储（缓冲）而不是立即输出。
    { bufferLogs: true }
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // 启用应用程序的关闭钩子。在应用程序关闭时执行必要的清理操作，从而提高应用程序的可靠性和稳定性。
  app.enableShutdownHooks();

  // TODO: 待封装
  const config = app.get(AppConfig);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = config.port || 3000;

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.flushLogs(); // 刷新日志：将内存中的日志数据写入到持久存储（如文件或数据库）中

  // TODO: 其他设置
  // 启用跨域请求
  app.enableCors(config.cors);
  // 用于启用 API 版本控制。这里使用了 URI 版本控制策略。
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // 从依赖注入容器中获取了一个 HttpAdapterHost 实例，确保在需要时能够访问和操作底层的 HTTP 服务器实例。
  // const httpAdapterHost = app.get(HttpAdapterHost);

  // 直接访问和操作 Fastify 实例，利用 Fastify 提供的各种功能和插件来扩展和定制你的 NestJS 应用程序。
  const fastifyInstance: FastifyInstance = app.getHttpAdapter().getInstance();
  // 提高 Fastify 与 Express 的兼容性
  applyExpressCompatibility(fastifyInstance);


  /*
  在 Fastify 应用实例上注册了fastify-helmet 插件，并传递了一个空对象作为配置选项。
  fastify-helmet 是一个用于增强 HTTP 头安全性的插件。
  它基于 Helmet.js，为 Fastify 提供了一组中间件，用于设置各种 HTTP 头，
  以帮助保护应用免受一些常见的 Web 安全漏洞的攻击，例如跨站脚本（XSS）攻击和点击劫持。
 */
  app.register(fastifyHelmet, {});

  await app.listen(port, '0.0.0');
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
