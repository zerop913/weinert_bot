import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password, telegramUserId } = await request.json();

    // Отладочная информация
    console.log("Auth attempt:", {
      receivedPassword: password
        ? `${password.substring(0, 3)}...`
        : "no password",
      envPassword: process.env.ADMIN_PASSWORD
        ? `${process.env.ADMIN_PASSWORD.substring(0, 3)}...`
        : "no env password",
      telegramUserId,
    });

    // Проверяем авторизацию через пароль
    if (password && password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        message: "Авторизация успешна",
        method: "password",
      });
    }

    // Проверяем авторизацию через Telegram (если передан telegramUserId)
    if (telegramUserId) {
      const adminIds = [1109961645]; // zerop913
      if (adminIds.includes(parseInt(telegramUserId))) {
        return NextResponse.json({
          success: true,
          message: "Авторизация через Telegram успешна",
          method: "telegram",
        });
      }
    }

    return NextResponse.json(
      { error: "Неверный пароль или отсутствие прав доступа" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error in admin auth:", error);
    return NextResponse.json({ error: "Ошибка авторизации" }, { status: 500 });
  }
}
