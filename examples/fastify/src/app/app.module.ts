import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import rootConfig from '../config/root.config';
import { setupYamlBaseConfigModule } from '@aiofc/config';
import { Logger, setupLoggerModule } from '@aiofc/logger';

@Module({
  imports: [
    setupLoggerModule(),
    setupYamlBaseConfigModule(__dirname, rootConfig),
  ],
  controllers: [AppController],
  providers: [AppService,Logger],
})
export class AppModule {}
