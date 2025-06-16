import { NextRequest, NextResponse } from "next/server";
import { initializeBot } from "@/bot/bot";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Токен бота обязателен" },
        { status: 400 }
      );
    }

    const bot = initializeBot(token);

    return NextResponse.json({
      success: true,
      message: "Бот успешно инициализирован",
    });
  } catch (error) {
    console.error("Error initializing bot:", error);
    return NextResponse.json(
      { error: "Ошибка при инициализации бота" },
      { status: 500 }
    );
  }
}
