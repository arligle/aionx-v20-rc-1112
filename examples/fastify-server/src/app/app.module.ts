import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import rootConfig from '../config/root.config';
import { configModuleForRoot } from '@aiofc/config';
import { Logger, loggerModuleForRootAsync } from '@aiofc/logger';

@Module({
  imports: [
    loggerModuleForRootAsync(),
    configModuleForRoot(__dirname, rootConfig),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
