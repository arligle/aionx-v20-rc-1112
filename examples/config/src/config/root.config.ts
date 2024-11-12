// import { LoggerConfig } from "@aionx/logger";
import { ValidateNestedProperty } from "@aiofc/config";
import { AppConfig } from "./app.config";

export default class RootConfig {
  @ValidateNestedProperty({ classType: AppConfig })
  public readonly app!: AppConfig;
}
