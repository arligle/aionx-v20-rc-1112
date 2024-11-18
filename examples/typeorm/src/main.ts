import { fastifyBootstrap } from "@aiofc/fastify-server";
import { AppModule } from "./app/app.module";
import { initializeTransactionalContext } from 'typeorm-transactional';

// 初始化事务上下文
initializeTransactionalContext();
fastifyBootstrap(AppModule);