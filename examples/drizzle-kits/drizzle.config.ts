/**
 * Drizzle 配置文件
 * 旧的版本需要声明使用的驱动程序，新版本不需要。
 * Drizzle-kit 会自动检查驱动程序:

drizzle-kit先检查pg驱动是否安装并使用。
如果没有，将尝试找到 postgres 驱动程序并使用它。
如果仍然找不到，将尝试查找@vercel/postgres。
然后尝试@neondatabase/serverless。
如果没有找到任何内容，则会抛出错误。

 */
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schemas/schema.ts',
  out: './drizzle',
  dbCredentials: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    url: process.env.DATABASE_URL!,
    // host: process.env.POSTGRES_HOST,
    // port: process.env.POSTGRES_PORT,
    // user: process.env.POSTGRES_USER,
    // password: process.env.POSTGRES_PASSWORD,
    // database: process.env.POSTGRES_DB,
  },
});
