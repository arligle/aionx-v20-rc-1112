import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import rootConfig from '../config/root.config';
import { configModuleForRoot } from '@aiofc/config';
import { Logger, loggerModuleForRootAsync } from '@aiofc/logger';
import * as Entities from '../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleInitialize } from '@aiofc/typeorm';

@Module({
  imports: [
    loggerModuleForRootAsync(),
    configModuleForRoot(__dirname, rootConfig),

    /*
      这两个函数通常不会有冲突，因为它们的作用是不同的，并且在不同的层面上进行配置。
      typeOrmModuleInitialize():
      这个函数用于初始化 TypeORM 模块，并配置与数据库的连接。
      它调用 TypeOrmModule.forRootAsync来设置数据库连接的全局配置。
      这是一个全局配置，通常在应用程序启动时执行一次。

      TypeOrmModule.forFeature(Object.values(Entities)):
      这个函数用于在当前模块中注册特定的实体，使它们在当前模块中可用。
      它不会重新配置数据库连接，而是基于已经配置好的数据库连接来注册实体。
      这是一个局部配置，通常在每个需要访问这些实体的模块中执行。

      这两个函数的作用是互补的：
      typeOrmModuleInitialize() 负责全局的数据库连接配置。
      TypeOrmModule.forFeature() 负责在特定模块中注册实体，以及操作这些实体。
      因此，它们可以一起使用而不会产生冲突,相反应该根据需要配合一起使用。
    */
    typeOrmModuleInitialize(), // 全局
    // 是否需要讲这些实体与数据库同步需要再配置文件.env.yaml中配置：synchronize: true
    TypeOrmModule.forFeature(Object.values(Entities)), // 局部
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
