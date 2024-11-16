-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "cat" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"age" integer NOT NULL,
	"breed" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar NOT NULL,
	"lastName" varchar NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profile" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"tenant_id" varchar NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"version" integer NOT NULL,
	"email" varchar(320) NOT NULL,
	CONSTRAINT "UQ_e336cc51b61c40b1b1731308aa5" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"content" text,
	"author" text,
	"summary" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_f198c6293bda22e255332cc1f8" ON "user_profile" ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_e336cc51b61c40b1b1731308aa" ON "user_profile" ("email");
*/