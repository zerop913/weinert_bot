import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Проверяем наличие DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL не найден в переменных окружения");
}

// Логируем для отладки (безопасно - скрываем пароль)
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log(
  "DATABASE_URL (masked):",
  process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":***@")
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Supabase всегда требует SSL
});

export const db = drizzle(pool, { schema });
