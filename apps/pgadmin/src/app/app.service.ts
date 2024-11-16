import { InjectDrizzle } from '@aiofc/drizzle-core';
import { DrizzlePostgres } from '@aiofc/postgres-js';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { sql } from 'drizzle-orm';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(@InjectDrizzle() private readonly drizzle: DrizzlePostgres) {}
  // 实现 OnApplicationBootstrap 接口，这是NestJS的生命周期事件
  // https://docs.nestjs.com/fundamentals/lifecycle-events
  async onApplicationBootstrap() {
    console.log(`\n正在连接数据库\n`);
    console.log(
      await this.drizzle.execute(sql`
        SELECT schema_name
        FROM information_schema.schemata;
        `)
    );
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
