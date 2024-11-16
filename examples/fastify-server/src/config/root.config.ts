// import { LoggerConfig } from "@aionx/logger";
import { ValidateNestedProperty } from "@aiofc/config";
import { AppConfig } from "@aiofc/fastify-server";
import { LoggerConfig } from "@aiofc/logger";

export default class RootConfig {
  @ValidateNestedProperty({ classType: AppConfig })
  public readonly app!: AppConfig;

  @ValidateNestedProperty({ classType: LoggerConfig })
  public readonly logger!: LoggerConfig;
}
