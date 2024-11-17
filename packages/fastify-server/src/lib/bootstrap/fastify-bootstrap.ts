import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { FastifyInstance } from 'fastify';
import { createFastifyInstance, initialize } from './setup';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppConfig } from '../config/app.config';
import { Logger } from '@aiofc/logger';

export async function fastifyBootstrap(module: any) {
  const app = await NestFactory.create<NestFastifyApplication>(
    module,
    createFastifyInstance(),
    // 设置为 true 时，日志消息将被暂时存储（缓冲）而不是立即输出。
    {
      bufferLogs: true,
      // TODO: 在express 设置为 false 时，将关闭请求的日志记录。但是，在fastify不起作用，我也不知道为什么
      // logger: false
    }
  );
  useContainer(app.select(module), { fallbackOnErrors: true });

  const config = app.get(AppConfig);
  const logger = app.get(Logger);
  // 直接访问和操作 Fastify 实例，利用 Fastify 提供的各种功能和插件来扩展和定制你的 NestJS 应用程序。
  const fastifyInstance: FastifyInstance = app.getHttpAdapter().getInstance();
  // 从依赖注入容器中获取了一个 HttpAdapterHost 实例，确保在需要时能够访问和操作底层的 HTTP 服务器实例。
  const httpAdapterHost = app.get(HttpAdapterHost);

  const server = await initialize(
    app,
    config,
    logger,
    fastifyInstance,
    httpAdapterHost
  );

  await server.listen(config.port || 3000, '0.0.0.0');
  logger.log(
    `🚀 Application is running on: http://localhost:${config.port}/${config.prefix}`
  );

  // return server;
}
