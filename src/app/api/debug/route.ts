import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    env: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL
        ? "✅ Установлена"
        : "❌ Отсутствует",
      SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID
        ? "✅ Установлена"
        : "❌ Отсутствует",
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
        ? "✅ Установлен"
        : "❌ Отсутствует",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
        ? "✅ Установлена"
        : "❌ Отсутствует",
      VERCEL: process.env.VERCEL ? "✅ Это Vercel" : "❌ Не Vercel",
      VERCEL_ENV: process.env.VERCEL_ENV || "не установлена",
    },
    timestamp: new Date().toISOString(),
  });
}
