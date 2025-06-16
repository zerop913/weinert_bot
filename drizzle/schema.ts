import { pgTable, uuid, text, integer, boolean, timestamp, unique, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const orderStatus = pgEnum("order_status", ['новый', 'в работе', 'выполнен', 'отменен'])


export const faqs = pgTable("faqs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	question: text().notNull(),
	answer: text().notNull(),
	order: integer().default(0).notNull(),
	isVisible: boolean("is_visible").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	author: text().notNull(),
	platform: text().notNull(),
	content: text().notNull(),
	rating: integer().default(5).notNull(),
	isVisible: boolean("is_visible").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const services = pgTable("services", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	price: text().notNull(),
	description: text(),
	category: text().notNull(),
	order: integer().default(0).notNull(),
	isVisible: boolean("is_visible").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const settings = pgTable("settings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	key: text().notNull(),
	value: text().notNull(),
	description: text(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("settings_key_unique").on(table.key),
]);

export const socialLinks = pgTable("social_links", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	url: text().notNull(),
	icon: text().notNull(),
	order: integer().default(0).notNull(),
	isVisible: boolean("is_visible").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const artOrders = pgTable("art_orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	charactersCount: integer("characters_count").notNull(),
	references: text().notNull(),
	idea: text().notNull(),
	additionalWishes: text("additional_wishes"),
	deadline: text().notNull(),
	desiredPrice: text("desired_price").notNull(),
	contactInfo: text("contact_info"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	orderNumber: text("order_number").notNull(),
	status: orderStatus().default('новый').notNull(),
	adminComment: text("admin_comment"),
	telegramUserId: text("telegram_user_id"),
}, (table) => [
	unique("art_orders_order_number_unique").on(table.orderNumber),
]);
