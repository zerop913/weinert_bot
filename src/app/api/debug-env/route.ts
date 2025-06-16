import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const envVars = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 20),
      NODE_ENV: process.env.NODE_ENV,
      TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      allEnvKeys: Object.keys(process.env).filter(
        (key) =>
          key.includes("DATABASE") ||
          key.includes("POSTGRES") ||
          key.includes("SUPABASE")
      ),
    };

    return NextResponse.json(envVars);
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
