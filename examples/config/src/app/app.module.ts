import { Logger, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import rootConfig from '../config/root.config';
import { configModuleForRoot } from '@aiofc/config';

@Module({
  imports: [
    configModuleForRoot(__dirname, rootConfig),
  ],
  controllers: [AppController],
  providers: [AppService,Logger],
})
export class AppModule {}
