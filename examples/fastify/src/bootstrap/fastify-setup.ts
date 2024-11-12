import { FastifyAdapter } from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';
import { generateRandomId } from '../utils/crypto';

// TODO: FastifyAdapter 是 Fastify 的 NestJS 适配器，它允许我们在 NestJS 应用中使用 Fastify。
export function createFastifyInstance(): FastifyAdapter {
  const REQUEST_ID_HEADER = 'x-request-id';
  return new FastifyAdapter({
    // 给每一个请求分配一个ID，用于追踪请求：
    // 1、如果请求已经有了'x-request-id'
    // 2、否则生成一个随机ID
    genReqId: (req: { headers: { [x: string]: any } }) => {
      const requestId = req.headers[REQUEST_ID_HEADER];
      return requestId || generateRandomId();
    },
    bodyLimit: 10_485_760,
  });
}

// TODO: 关于提高 Fastify 与 Express 中间件的兼容性的建议(官方)
export function applyExpressCompatibility(
  fastifyInstance: FastifyInstance
) {
  // this is a recommendation from fastify to improve compatibility with express middlewares
  fastifyInstance
    .addHook('onRequest', async (req) => {
      req.socket['encrypted'] = process.env.NODE_ENV === 'production';
    })
    .decorateReply(
      'setHeader',
      /* istanbul ignore next */ function (name: string, value: unknown) {
        this.header(name, value);
      }
    )
    .decorateReply(
      'end',
      /* istanbul ignore next */ function () {
        this.send('');
      }
    );
}


