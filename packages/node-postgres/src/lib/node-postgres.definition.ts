import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DrizzlePGConfig } from './node-postgres.interface';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<DrizzlePGConfig>()
  .setExtras(
    {
      tag: 'default',
    },
    (definition, extras) => ({
      ...definition,
      tag: extras.tag,
    })
  )
  .build();
/*
definition 是模块的当前定义对象
extras 是额外的配置选项对象
虽然 definition 的具体类型没有在代码中显式定义，
但它是 ConfigurableModuleBuilder 内部生成的一个对象，包含模块的当前定义状态。

代码解释：
通脱ConfigurableModuleBuilder类的build方法，我们得到了一个ConfigurableModuleHost
ConfigurableModuleHost是一个接口，它定义了ConfigurableModuleBuilder类的实例化对象的属性。
并通过结构赋值的方式，提取它的属性，并赋值给对应的常量，从而得到了ConfigurableModuleClass、MODULE_OPTIONS_TOKEN、OPTIONS_TYPE和ASYNC_OPTIONS_TYPE。

事实上，你还可以在结构赋值时，通过别名的方式，将这些属性重命名为你想要的名字。例如：
export const {
  ConfigurableModuleClass: ConfigurableDatabaseModule,
  MODULE_OPTIONS_TOKEN: DATABASE_OPTIONS,
  OPTIONS_TYPE: DatabaseOptionsType,
  ASYNC_OPTIONS_TYPE: AsyncDatabaseOptionsType,
} = new ConfigurableModuleBuilder<DrizzlePGConfig>()
  .setExtras(
    {
      tag: 'default',
    },
    (definition, extras) => ({
      ...definition,
      tag: extras.tag,
    })
  )
  .build();
  通过这种方式，你可以在解构赋值时重命名属性，使得变量名称更加直观和具有描述性，便于理解和使用。
*/