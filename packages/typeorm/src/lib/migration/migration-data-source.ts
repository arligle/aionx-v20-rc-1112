import { Module } from '@nestjs/common';

import * as path from 'node:path';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DbConfig } from '../config/db';
import { NestFactory } from '@nestjs/core';
import { configModuleForRoot } from '@aiofc/config';
import { ValidateNestedProperty } from '@aiofc/validation';

const sourceDir = path.join(
  process.cwd(),
  // todo figure out how to improve it using nx
  `apps/${process.env['MIGRATION_APP_NAME']}/src`,
);

class RootConfig {
  @ValidateNestedProperty({ classType: DbConfig })
  public readonly db!: DbConfig;
}

@Module({
  imports: [configModuleForRoot(`${sourceDir}/app`, RootConfig)],
})
class DatabaseMigrationModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    DatabaseMigrationModule,
    {
      logger: ['warn', 'error', 'fatal', 'verbose'],
    },
  );

  return app.get(RootConfig).db;
}

const appDir = path.join(sourceDir, 'app');
// TODO: 这里的路径定义必须在具体的应用中遵循，否则会导致路径错误
export const AppDataSource = bootstrap().then((db) => {
  return new DataSource({
    ...(db as DbConfig),
    entities: [path.join(appDir, 'database/entities/**/*{.ts,.js}')],
    migrations: [
      path.join(appDir, 'database/migrations/**/!(*index){.ts,.js}'),
    ],
  } as DataSourceOptions);
});
