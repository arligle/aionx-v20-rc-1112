import { serial, text, pgTable } from 'drizzle-orm/pg-core';

const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title'),
  author: text('author'),
  content: text('content'),
  summary: text('summary'),
});

export const databaseSchema = {
  articles,
};

export { articles };
