import { Global, DynamicModule } from '@nestjs/common';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './node-postgres.definition';
import { DrizzlePGService } from './node-postgres.service';
import { DrizzlePGConfig } from './node-postgres.interface';

@Global()
export class DrizzlePGModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    const { providers = [], exports = [], ...props } = super.register(options);
    return {
      ...props,
      providers: [
        ...providers,
        DrizzlePGService,
        {
          provide: options?.tag || 'default',
          useFactory: async (drizzleService: DrizzlePGService) => {
            return await drizzleService.getDrizzle(options);
          },
          inject: [DrizzlePGService],
        },
      ],
      exports: [...exports, options?.tag || 'default'],
    };
  }
  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const {
      providers = [],
      exports = [],
      ...props
    } = super.registerAsync(options);
    return {
      ...props,
      providers: [
        ...providers,
        DrizzlePGService,
        {
          provide: options?.tag || 'default',
          useFactory: async (
            drizzleService: DrizzlePGService,
            config: DrizzlePGConfig
          ) => {
            return await drizzleService.getDrizzle(config);
          },
          inject: [DrizzlePGService, MODULE_OPTIONS_TOKEN],
        },
      ],
      exports: [...exports, options?.tag || 'default'],
    };
  }
}

/*
这段代码定义了一个名为 `DrizzlePGModule`的全局模块，用于配置和提供 PostgreSQL 数据库连接服务。
这个模块继承自 `ConfigurableModuleClass`，并提供了同步和异步两种注册方法。

定义了两个静态方法`register`和`registerAsync`，用于同步和异步注册模块：

1. **register 方法**：
   - 接受一个 [`options`](node-postgres.module.ts ) 参数，类型为 [`OPTIONS_TYPE`](node-postgres.definition.ts )。
   - 调用父类的 [`register`](node-postgres.definition.ts ) 方法，并解构返回的对象，获取 providers、exports 和其他属性。
   - 返回一个新的动态模块对象，包含合并后的 providers 和 exports 数组，以及其他属性。
   - 在 providers 数组中，添加了`DrizzlePGService` 和一个自定义提供者。自定义提供者使用 useFactory 方法，通过注入`DrizzlePGService`，调用其 getDrizzle 方法获取数据库连接。

2. **registerAsync 方法**：
   - 接受一个 [`options`](node-postgres.module.ts ) 参数，类型为 [`ASYNC_OPTIONS_TYPE`](node-postgres.definition.ts )。
   - 调用父类的 [`registerAsync`](node-postgres.definition.ts ) 方法，并解构返回的对象，获取 providers、exports 和其他属性。
   - 返回一个新的动态模块对象，包含合并后的 providers 和 exports 数组，以及其他属性。
   - 在 providers 数组中，添加了`DrizzlePGService` 和一个自定义提供者。自定义提供者使用 useFactory 方法，通过注入 `DrizzlePGService`调用 `DrizzlePGService` 的 getDrizzle 方法获取数据库连接。

总的来说，这段代码通过定义全局模块 [`DrizzlePGModule`](node-postgres.module.ts )，提供了同步和异步两种注册方法，用于配置和提供 PostgreSQL 数据库连接服务。通过继承 [`ConfigurableModuleClass`](node-postgres.definition.ts )，模块可以灵活地配置和初始化，并通过依赖注入机制提供数据库连接服务。
*/
