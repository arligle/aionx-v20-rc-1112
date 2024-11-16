import { InjectDrizzle } from '@aiofc/drizzle-core';

export const Drizzle = () => InjectDrizzle();
export const Drizzle2 = () => InjectDrizzle('named_db');
