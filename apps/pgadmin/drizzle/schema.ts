import { pgTable, serial, varchar, integer, boolean, index, uniqueIndex, unique, timestamp, uuid, text } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const cat = pgTable("cat", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	age: integer("age").notNull(),
	breed: varchar("breed").notNull(),
});

export const user = pgTable("user", {
	id: serial("id").primaryKey().notNull(),
	firstName: varchar("firstName").notNull(),
	lastName: varchar("lastName").notNull(),
	isActive: boolean("isActive").default(true).notNull(),
});

export const user_profile = pgTable("user_profile", {
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deleted_at: timestamp("deleted_at", { mode: 'string' }),
	tenant_id: varchar("tenant_id").notNull(),
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	version: integer("version").notNull(),
	email: varchar("email", { length: 320 }).notNull(),
},
(table) => {
	return {
		IDX_f198c6293bda22e255332cc1f8: index("IDX_f198c6293bda22e255332cc1f8").on(table.tenant_id),
		IDX_e336cc51b61c40b1b1731308aa: uniqueIndex("IDX_e336cc51b61c40b1b1731308aa").on(table.email),
		UQ_e336cc51b61c40b1b1731308aa5: unique("UQ_e336cc51b61c40b1b1731308aa5").on(table.email),
	}
});

export const articles = pgTable("articles", {
	id: serial("id").primaryKey().notNull(),
	title: text("title"),
	content: text("content"),
	author: text("author"),
	summary: text("summary"),
});