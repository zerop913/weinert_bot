import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artOrders } from "@/lib/db/schema";
import { generateOrderNumber } from "@/utils/orderUtils";
import { getBotInstance, initializeBot } from "@/bot/bot";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderNumber = generateOrderNumber();
    const newOrder = await db
      .insert(artOrders)
      .values({
        orderNumber,
        name: body.name,
        charactersCount: body.charactersCount,
        references: body.references,
        idea: body.idea,
        additionalWishes: body.additionalWishes || "",
        deadline: body.deadline,
        desiredPrice: body.desiredPrice,
        contactInfo: body.contactInfo || "",
        telegramUserId: body.telegramUserId || "",
        telegramUsername: body.telegramUsername || "",
        status: "новый",
      })
      .returning(); // Отправляем уведомления
    const bot = getBotInstance();
    if (!bot && process.env.TELEGRAM_BOT_TOKEN) {
      // Инициализируем бота, если он еще не создан
      console.log("Инициализируем бота для уведомлений...");
      initializeBot(process.env.TELEGRAM_BOT_TOKEN);
    }    const botInstance = getBotInstance();
    if (botInstance) {
      console.log("Отправляем уведомления для заказа:", orderNumber);
      
      try {
        // Уведомление клиенту (только если есть telegramUserId)
        if (body.telegramUserId) {
          await botInstance.notifyOrderCreated(body.telegramUserId, {
            orderNumber,
            serviceName: "Художественная комиссия",
            price: body.desiredPrice,
            deadline: body.deadline,
          });
          console.log("Уведомление клиенту отправлено");
        } else {
          console.log("Telegram ID пользователя не найден, уведомление клиенту не отправлено");
        }

        // Уведомление админам (отправляется всегда)
        await botInstance.notifyAdminsNewOrder({
          orderNumber,
          clientName: body.name,
          idea: body.idea,
          price: body.desiredPrice,
          deadline: body.deadline,
          telegramUserId: body.telegramUserId,
          telegramUsername: body.telegramUsername,
        });
        console.log("Уведомление админам отправлено");

      } catch (error) {
        console.error("Ошибка при отправке уведомлений:", error);
      }
    } else {
      console.log("Бот не инициализирован:", {
        botExists: !!botInstance,
        tokenExists: !!process.env.TELEGRAM_BOT_TOKEN,
      });
    }

    return NextResponse.json(newOrder[0], { status: 201 });
  } catch (error) {
    console.error("Error creating art order:", error);
    return NextResponse.json(
      { error: "Ошибка при создании заказа" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await db
      .select()
      .from(artOrders)
      .orderBy(artOrders.createdAt);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching art orders:", error);
    return NextResponse.json(
      { error: "Ошибка при получении заказов" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, adminComment } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Необходимо указать ID заказа и статус" },
        { status: 400 }
      );
    }

    // Получаем текущий заказ
    const currentOrder = await db
      .select()
      .from(artOrders)
      .where(eq(artOrders.id, id))
      .limit(1);

    if (currentOrder.length === 0) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }

    // Обновляем заказ
    const updatedOrder = await db
      .update(artOrders)
      .set({
        status,
        adminComment: status === "отменен" ? adminComment : null,
        updatedAt: new Date(),
      })
      .where(eq(artOrders.id, id))
      .returning();

    // Отправляем уведомление при отмене
    const bot = getBotInstance();
    if (bot && status === "отменен" && currentOrder[0].telegramUserId) {
      await bot.notifyOrderCancelled(
        currentOrder[0].telegramUserId,
        currentOrder[0].orderNumber,
        adminComment
      );
    }

    return NextResponse.json(updatedOrder[0]);
  } catch (error) {
    console.error("Error updating art order:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении заказа" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Необходимо указать ID заказа для удаления" },
        { status: 400 }
      );
    }

    // Проверяем, существует ли заказ
    const existingOrder = await db
      .select()
      .from(artOrders)
      .where(eq(artOrders.id, id))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }

    // Удаляем заказ
    await db.delete(artOrders).where(eq(artOrders.id, id));

    return NextResponse.json({
      message: "Заказ успешно удален",
      orderNumber: existingOrder[0].orderNumber,
    });
  } catch (error) {
    console.error("Error deleting art order:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении заказа" },
      { status: 500 }
    );
  }
}
