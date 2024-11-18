import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  // 实现 OnApplicationBootstrap 接口，这是NestJS的生命周期事件
  // https://docs.nestjs.com/fundamentals/lifecycle-events
  async onApplicationBootstrap() {
    console.log(`\n正在连接数据库\n`);
    // console.log(
    //   await this.drizzle.execute(sql`
    //     SELECT schema_name
    //     FROM information_schema.schemata;
    //     `)
    // );
  }

  getData(): { message: string } {
    return { message: 'Hello Typeorm-demo' };
  }
}
