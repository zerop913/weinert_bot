import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enum для статусов заказов
export const orderStatusEnum = pgEnum("order_status", [
  "новый",
  "в работе",
  "выполнен",
  "отменен",
]);

export const artOrders = pgTable("art_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  status: orderStatusEnum("status").default("новый").notNull(),
  adminComment: text("admin_comment"), // Комментарий админа при отмене
  name: text("name").notNull(),
  charactersCount: integer("characters_count").notNull(),
  references: text("references").notNull(),
  idea: text("idea").notNull(),
  additionalWishes: text("additional_wishes"),
  deadline: text("deadline").notNull(),
  desiredPrice: text("desired_price").notNull(),
  contactInfo: text("contact_info"),
  telegramUserId: text("telegram_user_id"), // ID пользователя Telegram для уведомлений
  telegramUsername: text("telegram_username"), // Username пользователя Telegram
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  author: text("author").notNull(),
  platform: text("platform").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").default(5).notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const faqs = pgTable("faqs", {
  id: uuid("id").defaultRandom().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").default(0).notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  price: text("price").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'main' or 'additional'
  order: integer("order").default(0).notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const socialLinks = pgTable("social_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull(), // icon name from react-icons
  order: integer("order").default(0).notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const telegramUsers = pgTable("telegram_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  telegramId: text("telegram_id").notNull().unique(),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
