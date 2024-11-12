import { Logger, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import rootConfig from '../config/root.config';
import { setupYamlBaseConfigModule } from '@aiofc/config';

@Module({
  imports: [
    setupYamlBaseConfigModule(__dirname, rootConfig),
  ],
  controllers: [AppController],
  providers: [AppService,Logger],
})
export class AppModule {}
