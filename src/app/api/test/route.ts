import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Простая проверка без обращения к базе данных
    return NextResponse.json({
      status: "OK",
      message: "API работает",
      timestamp: new Date().toISOString(),
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error("API Test Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
