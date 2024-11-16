import { DrizzlePostgres } from '@aiofc/postgres-js';
import * as dzSchema from './schema';

export * as dzSchema from './schema';
export type DrizzleSchema = typeof dzSchema;
export type DrizzleDb = DrizzlePostgres<DrizzleSchema>;
