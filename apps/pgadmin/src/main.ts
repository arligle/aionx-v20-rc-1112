import { fastifyBootstrap } from "@aiofc/fastify-server";
import { AppModule } from "./app/app.module";

fastifyBootstrap(AppModule);