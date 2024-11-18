import { ValidateNestedProperty } from "@aiofc/config";
import { AppConfig } from "@aiofc/fastify-server";
import { LoggerConfig } from "@aiofc/logger";
import { DbConfig } from "@aiofc/typeorm";

export default class RootConfig {
  @ValidateNestedProperty({ classType: AppConfig })
  public readonly app!: AppConfig;

  @ValidateNestedProperty({ classType: LoggerConfig })
  public readonly logger!: LoggerConfig;

    @ValidateNestedProperty({ classType: DbConfig })
  public readonly db!: DbConfig;
}
