import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/bot/config";

/**
 * Middleware для проверки прав администратора
 */
export function createAdminMiddleware() {
  return async (request: NextRequest) => {
    // Получаем Telegram User ID из заголовков или параметров
    const telegramUserId =
      request.headers.get("X-Telegram-User-Id") ||
      request.nextUrl.searchParams.get("user_id");

    if (!telegramUserId) {
      return NextResponse.json(
        { error: "Требуется авторизация через Telegram" },
        { status: 401 }
      );
    }

    const userId = parseInt(telegramUserId);
    if (!isAdmin(userId)) {
      return NextResponse.json(
        { error: "Недостаточно прав доступа" },
        { status: 403 }
      );
    }

    // Пропускаем запрос дальше
    return NextResponse.next();
  };
}

/**
 * Проверяет права администратора из request
 */
export async function checkAdminPermissions(
  request: NextRequest
): Promise<boolean> {
  const telegramUserId =
    request.headers.get("X-Telegram-User-Id") ||
    request.nextUrl.searchParams.get("user_id");

  if (!telegramUserId) {
    return false;
  }

  const userId = parseInt(telegramUserId);
  return isAdmin(userId);
}
