import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artOrders, telegramUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getBotInstance, initializeBot } from "@/bot/bot";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, message } = body;

    if (!orderNumber || !message) {
      return NextResponse.json(
        { error: "Необходимо указать номер заказа и сообщение" },
        { status: 400 }
      );
    }

    // Ищем заказ
    const order = await db
      .select()
      .from(artOrders)
      .where(eq(artOrders.orderNumber, orderNumber))
      .limit(1);

    if (order.length === 0) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }

    const orderData = order[0];
    let telegramUserId = orderData.telegramUserId;

    // Если нет прямого telegramUserId, ищем по имени и username
    if (!telegramUserId && orderData.telegramUsername) {
      const users = await db
        .select()
        .from(telegramUsers)
        .where(eq(telegramUsers.username, orderData.telegramUsername))
        .limit(1);

      if (users.length > 0) {
        telegramUserId = users[0].telegramId;
      }
    }

    if (!telegramUserId) {
      return NextResponse.json(
        { error: "Не удалось найти Telegram ID пользователя" },
        { status: 404 }
      );
    }

    // Отправляем сообщение
    const bot = getBotInstance();
    if (!bot && process.env.TELEGRAM_BOT_TOKEN) {
      initializeBot(process.env.TELEGRAM_BOT_TOKEN);
    }

    const botInstance = getBotInstance();
    if (botInstance) {
      await botInstance.sendMessage(parseInt(telegramUserId), message);
      return NextResponse.json({
        success: true,
        message: "Сообщение отправлено пользователю",
      });
    } else {
      return NextResponse.json(
        { error: "Бот не инициализирован" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending message to user:", error);
    return NextResponse.json(
      { error: "Ошибка при отправке сообщения" },
      { status: 500 }
    );
  }
}
