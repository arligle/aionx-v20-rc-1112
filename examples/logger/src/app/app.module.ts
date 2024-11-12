import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Logger, setupLoggerModule } from '@aiofc/logger';
import { setupYamlBaseConfigModule } from '@aiofc/config';
import rootConfig from '../config/root.config';

@Module({
  imports: [
    setupYamlBaseConfigModule(__dirname, rootConfig),
    setupLoggerModule(),
  ],
  controllers: [AppController],
  providers: [AppService,Logger],
})
export class AppModule {}
