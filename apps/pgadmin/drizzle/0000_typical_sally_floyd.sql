CREATE TABLE IF NOT EXISTS "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"author" text,
	"content" text,
	"summary" text
);
