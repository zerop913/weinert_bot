import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      adminPassword: process.env.ADMIN_PASSWORD
        ? "УСТАНОВЛЕН"
        : "НЕ УСТАНОВЛЕН",
      adminPasswordLength: process.env.ADMIN_PASSWORD?.length || 0,
      adminPasswordFirst3: process.env.ADMIN_PASSWORD?.substring(0, 3) || "N/A",
      nodeEnv: process.env.NODE_ENV,
      adminIds: process.env.ADMIN_TELEGRAM_IDS,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка получения переменных" },
      { status: 500 }
    );
  }
}
