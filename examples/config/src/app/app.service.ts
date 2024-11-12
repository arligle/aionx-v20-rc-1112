import { Injectable } from '@nestjs/common';
import RootConfig from '../config/root.config';
import { AppConfig } from '../config/app.config';

@Injectable()
export class AppService {
    // inject any config or sub-config you like
  constructor(
    private rootConfig: RootConfig,
    private appConfig: AppConfig,
  ) {}

  // enjoy type safety!
  public show(): any {
    const out = [
      `已经读取配置文件，试一下打印效果: 读取RootConfig ${this.rootConfig}`,
      `读取AppConfig下的 port 端口配置: ${this.appConfig.port}`,
    ].join('\n');

    return `${out}\n`;
  }
  // getData(): { message: string } {
  //   return { message: 'Hello API' };
  // }
}
