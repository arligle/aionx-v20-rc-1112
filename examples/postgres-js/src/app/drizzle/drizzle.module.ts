import { Module } from '@nestjs/common';
import { dzSchema } from './drizzle.schema';
import { DrizzlePostgresModule } from '@aiofc/postgres-js';

@Module({
  imports: [
    DrizzlePostgresModule.register({
      postgres: {
        url: 'postgres://postgres:postgres@localhost:5438/postgres',
      },
      config: { schema: dzSchema },
    }),
    DrizzlePostgresModule.register({
      name: 'named_db',
      postgres: {
        url: 'postgres://postgres:postgres@localhost:5438/test-db',
      },
      config: { schema: dzSchema },
    }),
  ],
})
export class DrizzleModule { }
