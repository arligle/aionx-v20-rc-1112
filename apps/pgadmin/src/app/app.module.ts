import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import rootConfig from '../config/root.config';
import { configModuleForRoot } from '@aiofc/config';
import { Logger, loggerModuleForRootAsync } from '@aiofc/logger';
import { DrizzleModuleConfiger } from '../drizzle/drizzle-configer.module';

@Module({
  imports: [
    loggerModuleForRootAsync(),
    configModuleForRoot(__dirname, rootConfig),
    DrizzleModuleConfiger,
  ],
  controllers: [AppController],
  providers: [AppService,Logger],
})
export class AppModule {}
