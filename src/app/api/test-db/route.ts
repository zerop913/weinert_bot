import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";

export async function GET() {
  try {
    console.log("Testing database connection...");

    // Пробуем простой запрос к базе данных
    const result = await db.select().from(services).limit(1);

    return NextResponse.json({
      status: "OK",
      message: "База данных работает",
      servicesCount: result.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database Test Error:", error);
    return NextResponse.json(
      {
        error: "Database Error",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
