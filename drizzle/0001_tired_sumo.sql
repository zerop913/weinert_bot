CREATE TYPE "public"."order_status" AS ENUM('новый', 'в работе', 'выполнен', 'отменен');--> statement-breakpoint
ALTER TABLE "art_orders" ADD COLUMN "order_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "art_orders" ADD COLUMN "status" "order_status" DEFAULT 'новый' NOT NULL;--> statement-breakpoint
ALTER TABLE "art_orders" ADD COLUMN "admin_comment" text;--> statement-breakpoint
ALTER TABLE "art_orders" ADD COLUMN "telegram_user_id" text;--> statement-breakpoint
ALTER TABLE "art_orders" ADD CONSTRAINT "art_orders_order_number_unique" UNIQUE("order_number");