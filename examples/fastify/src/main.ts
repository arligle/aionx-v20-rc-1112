import { AppModule } from "./app/app.module";
import { fastifyBootstrap } from "./bootstrap/fastify-bootstrap";

fastifyBootstrap(AppModule);